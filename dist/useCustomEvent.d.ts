import { AnyFn } from './util';
/**
 * 触发一个自定义事件
 * eventKey: 事件名
 * payload: 参数
 * */
export declare function customEventEmit(eventKey: string, payload?: any): void;
/**
 * 绑定一个自定义事件，可以在任意组件内触发它, 每个事件可以多次绑定不同的处理函数
 * eventKey? - 事件名
 * handle? - 事件处理程序
 * inputs? - 依赖数组，默认会在每一次更新时替换handle，当handle中不依赖或部分依赖其他状态时，可通过此项指定(!不要通过inputs传入未memo的引用对象!)
 * */
export declare function useCustomEvent(eventKey?: string, handle?: AnyFn, inputs?: any[]): typeof customEventEmit;
