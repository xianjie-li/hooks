import { useState } from 'react';
import { useUpdateEffect } from 'react-use';

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

const VALUE = 'value';
const DEFAULT_VALUE = 'defaultValue';
/**
 * @param props - 透传消费组件的props，包含FormLike中的任意属性
 * @param defaultValue - 默认值，会被value与defaultValue覆盖
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
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


  const [state, setState] = useState(() => {
    if (VALUE in props) {
      return value;
    }
    if (DEFAULT_VALUE in props) {
      return propDefaultValue;
    }
    return defaultValue;
  });

  useUpdateEffect(() => {
    if (VALUE in props) {
      setState(value);
    }
  }, [value]);

  const setFormState: FormLike<T, Ext>['onChange'] = (value, extra) => {
    if (!(VALUE in props)) {
      setState(value);
    }
    onChange && onChange(value, extra);
  };

  return [state, setFormState] as const;
}
