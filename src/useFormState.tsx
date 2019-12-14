import { useState, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { isFunction } from '@lxjx/utils';

import { AnyObject } from './util';

/**
 * 表单组件的统一接口
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLike<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra?: Ext) => void;
  defaultValue?: T;
}

interface SetFormState<T, Ext = any> {
  (patch: T | ((prev: T) => T), extra?: Ext): void
}

const VALUE = 'value';
const DEFAULT_VALUE = 'defaultValue';
const TRIGGER = 'onChange';

/**
 * 当useFormState传入props的key与预设的不一致时，通过此函数进行映射
 * props - 透传给useFormState
 * maps - 将props中的指定key映射为value、defaultValue、onChange
 * */
export function formStateMap<T extends any>(props: T, { value, defaultValue, trigger }: { value?: string; defaultValue?: string; trigger?: string}) {
  const _props = { ...props };
  if (value && value in props) {
    _props[VALUE] = props[value];
  }
  if (defaultValue && defaultValue in props) {
    _props[DEFAULT_VALUE] = props[defaultValue];
  }
  if (trigger && trigger in props) {
    _props[TRIGGER] = props[trigger];
  }
  return _props;
}

/**
 * @param props - 透传消费组件的props，包含FormLike中的任意属性
 * @param defaultValue - 默认值，会被value与defaultValue覆盖
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * @returns [state, setFormState] - 表单状态与更新表单状态的方法，接口与useState相似
 * */
export function useFormState<T, Ext = any>(
  props: AnyObject & FormLike<T, Ext>,
  defaultValue?: T,
) {
  const {
    value,
    onChange,
    defaultValue: propDefaultValue,
  } = props;

  // 用于在一些特定的位置能立即获取到state
  const stateRef = useRef<T>(); 
  // 设置表单状态
  const [state, setState] = useState(() => {
    let val = defaultValue;
    if (VALUE in props) {
      val = value;
    }
    if (DEFAULT_VALUE in props) {
      val =  propDefaultValue;
    }
    return (stateRef.current = val);
  });

  /* 为受控组件同步状态 */
  useUpdateEffect(() => {
    if (VALUE in props) {
      // 如果两次值显式相等则跳过
      value !== stateRef.current && setState(stateRef.current = value);
    }
  }, [value]);

  /* 处理修改表单值 */
  const setFormState: SetFormState<T, Ext> = (patch, extra) => {
    /* 是受控组件则将新值通过onChange回传即可，非受控组件设置本地状态并通过onChange通知 */
    const hasValue = VALUE in props;
    if (isFunction(patch)) {
      const patchResult = patch(stateRef.current!);
      onChange && onChange(patchResult, extra);
      if (!hasValue) {
        setState(patchResult);
      }
    } else {
      onChange && onChange(patch, extra);
      if (!hasValue) {
        setState(patch);
      }
    }
  }

  return [state, setFormState] as const;
}
