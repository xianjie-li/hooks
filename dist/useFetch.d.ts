import { AnyObject } from './util';
export interface UseFetchOptions<Data> {
    /** 一个boolean或function，为false时，会阻止请求，为function时，取它的返回值，当函数内部抛出错误时，pass会被设置为false。可以用来实现串行请求。(即使阻止请求依然会设置payload) */
    pass?: boolean | (() => boolean);
    /** 类似effect(fn, inputs)，当依赖数组内的值发生改变时，重新进行请求, 确保长度不会发生改变，传入引用类型时请先memo */
    inputs?: any[];
    /** 是否在初次加载时进行请求，默认true */
    initFetch?: boolean;
    /** 指定extraData的初始值. */
    extraData?: object;
    /** 超时时间，默认8000ms */
    timeout?: number;
    /** 成功回调, 第二个参数在当次请求是在payload没有改变的情况下触发时为true */
    onSuccess?: (res: Data, isUpdate: boolean) => void;
    /** 错误回调 */
    onError?: (err: any) => void;
    /** 无论成功与否都会调用。注意，在旧的请求被新的请求覆盖掉时，不会触发。 */
    onComplete?: () => void;
    /** 请求超时的回调 */
    onTimeout?: () => void;
}
export interface UseFetchReturns<Payload, Data, ExtraData> {
    /** method方法resolve时，data为它resolve的值 */
    data: Data;
    /** 正在进行请求。该状态为互斥状态 */
    loading: boolean;
    /** method方法reject时，error为它reject的值。该状态为互斥状态 */
    error: any;
    /** 当请求超时会将它设置为true。该状态为互斥状态 */
    timeout: boolean;
    /** 当前用于请求的payload */
    payload: Payload;
    /** 设置payload并触发请求, 使用方式同类组件的setState() */
    setPayload: (patch: Partial<Payload> | ((payload: Payload) => Partial<Payload>)) => void;
    /** 设置payload并触发请求, 它会覆盖掉原有状态 */
    setOverPayload: (patch: Partial<Payload> | ((payload: Payload) => Partial<Payload>)) => void;
    /** 使用当前的payload更新请求 */
    update: () => void;
    /** 以指定Payload覆盖并发起请求，如果Payload未传，则与update()等效 */
    send: (patch: Partial<Payload> | ((payload: Payload) => Partial<Payload>)) => void;
    /** 存放额外数据，用于实现分页等功能 */
    extraData: ExtraData;
    /** 手动设置当前的data, 使用方式同类组件的setState() */
    setData: (patch: Partial<Data> | ((data: Data) => Partial<Data>)) => void;
    /** 设置extraData, 使用方式同类组件的setState() */
    setExtraData: (patch: Partial<ExtraData> | ((prevState: ExtraData) => Partial<ExtraData>)) => void;
}
export declare const useFetch: <Payload extends AnyObject, Data, ExtraData extends AnyObject>(method: (...arg: any[]) => Promise<Data>, initPayload?: Payload, options?: UseFetchOptions<Data>) => UseFetchReturns<Payload, Data, ExtraData>;
