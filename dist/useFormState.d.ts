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
/**
 * @param props - 透传消费组件的props，包含FormLike中的任意属性
 * @param defaultValue - 默认值，会被value与defaultValue覆盖
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * */
export declare function useFormState<T, Ext = any>(props: AnyObject & FormLike<T, Ext>, defaultValue?: T): readonly [T | undefined, (value: T, extra?: Ext | undefined) => void];
