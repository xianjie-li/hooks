declare type AnyObject = {
    [key: string]: any;
};
/** 返回类似类组件的this的实例属性 */
export declare function useSelf<T extends object>(init?: T): T;
/**
 * 可以把它理解为类组件setState API风格的useSelf，但它包含以下特点
 * 1. 在setState之后，可以立即通过`state.xx`获取新的值
 * 2. 在一些被memo的回调中，即使没有设置更新数组，依然可以通过state获取到最新的值
 * 3. 总之，它使用useSelf这样的可以在函数组件内任何地方使用的实例属性，又能在setState后触发组件的更新
 * */
export declare function useSyncState<T extends object>(init?: T): readonly [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void];
interface UseFetchOptions<Data> {
    inputs?: any[];
    extraData?: object;
    readonly key?: string;
    timeout?: number;
    onSuccess?: (res: Data, isUpdate: boolean) => void;
    onError?: (err: any) => void;
    onComplete?: () => void;
    onTimeout?: () => void;
}
interface UseFetchReturns<Params, Data, ExtraData> {
    data: Data;
    loading: boolean;
    error: any;
    timeout: boolean;
    params: Params;
    setParams: (patch: Partial<Params> | ((params: Params) => Partial<Params>)) => void;
    setData: (patch: Partial<Data> | ((data: Data) => Partial<Data>)) => void;
    update: () => void;
    extraData: ExtraData;
    setExtraData: (patch: Partial<ExtraData> | ((prevState: ExtraData) => Partial<ExtraData>)) => void;
}
export declare const fetchTrigger: (key: string, params?: AnyObject | undefined) => void;
export declare const useFetch: <Params extends AnyObject, Data, ExtraData extends AnyObject>(method: (...arg: any[]) => Promise<Data>, defaultParams?: Params | undefined, pass?: boolean | (() => boolean), options?: UseFetchOptions<Data>) => UseFetchReturns<Params, Data, ExtraData>;
export {};
