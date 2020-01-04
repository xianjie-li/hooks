import { AnyObject } from './util';
/**
 * 表单组件的统一接口
 * @interface <T> - value类型
 * */
export interface FormLike<T> {
    value?: T;
    onChange?: (value: T) => void;
    defaultValue?: T;
}
/**
 * 表单组件的统一接口， 包含额外参数
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
    value?: T;
    onChange?: (value: T, extra: Ext) => void;
    defaultValue?: T;
}
interface SetFormState<T, Ext = any> {
    (patch: T | ((prev: T) => T), extra?: Ext): void;
}
/**
 * 当useFormState传入props的key与预设的不一致时，通过此函数进行映射
 * props - 透传给useFormState
 * maps - 将props中的指定key映射为value、defaultValue、onChange
 * */
export declare function formStateMap<T extends any>(props: T, { value, defaultValue, trigger }: {
    value?: string;
    defaultValue?: string;
    trigger?: string;
}): T;
/**
 * @param props - 透传消费组件的props，包含FormLike中的任意属性
 * @param defaultValue - 默认值，会被value与defaultValue覆盖
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * @returns [state, setFormState] - 表单状态与更新表单状态的方法，接口与useState相似
 * */
export declare function useFormState<T, Ext = any>(props: AnyObject, defaultValue: T): readonly [T, SetFormState<T, Ext>];
export {};
