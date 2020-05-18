import { useState, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { isFunction, AnyObject } from '@lxjx/utils';

/**
 * 表单组件的统一接口
 * @type <T> - value类型
 * */
export interface FormLike<T> {
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}

/**
 * 表单组件的统一接口， 包含额外参数
 * @type <T> - value类型
 * @type <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra: Ext) => void;
  defaultValue?: T;
}

interface SetFormState<T, Ext = any> {
  (patch: T | ((prev: T) => T), extra?: Ext): void;
}

interface Config {
  /** 'value' | 自定义获取value的key */
  valueKey?: string;
  /** 'defaultValue' | 自定义获取defaultValue的key */
  defaultValueKey?: string;
  /** 'onChange' | 自定义onChange的key */
  triggerKey?: string;
}

/** 便捷的实现统一接口的受控、非受控表单组件 */
export function useFormState<T, Ext = any>(
  /** 透传消费组件的props，该组件需要实现FormLike接口 */
  props: AnyObject,
  /** 默认值，会被value与defaultValue覆盖*/
  defaultValue: T,
  /** 其他配置 */
  config?: Config
) {
  const {
    valueKey = 'value',
    defaultValueKey = 'defaultValue',
    triggerKey = 'onChange',
  } = config || {};

  const {
    [valueKey]: value,
    [triggerKey]: onChange,
    [defaultValueKey]: propDefaultValue,
  } = props;

  // 用于在一些特定的位置能立即获取到`state
  const stateRef = useRef<T>();

  // 设置表单状态
  const [state, setState] = useState(() => {
    // 初始状态获取说明: value > defaultValue > useFormState中配置的defaultValue
    let val = defaultValue;
    if (valueKey in props) {
      val = props[valueKey] === undefined ? defaultValue : value;
    }
    if (defaultValueKey in props) {
      val = props[valueKey] === undefined ? defaultValue : propDefaultValue;
    }
    return (stateRef.current = val);
  });

  /* 为受控组件同步状态 */
  useUpdateEffect(() => {
    if (valueKey in props) {
      // 如果两次值显式相等则跳过 , 考虑使用深度对比?
      value !== stateRef.current && setState((stateRef.current = value));
    }
  }, [value]);

  /* 处理修改表单值 */
  const setFormState: SetFormState<T, Ext> = (patch, extra) => {
    /* 是受控组件则将新值通过onChange回传即可，非受控组件设置本地状态并通过onChange通知 */
    const hasValue = valueKey in props;
    if (isFunction(patch)) {
      if (!hasValue) {
        setState(prev => {
          const patchResult = patch(prev);
          onChange && onChange(patchResult, extra);
          return patchResult;
        });
      } else {
        const patchResult = patch(stateRef.current!);
        onChange && onChange(patchResult, extra);
      }
    } else {
      onChange && onChange(patch, extra);
      if (!hasValue) {
        setState(patch);
      }
    }
  };

  return [state, setFormState] as const;
}
