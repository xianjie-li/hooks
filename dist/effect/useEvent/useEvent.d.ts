import { AnyFunction } from '@lxjx/utils';
/**
 * 自定义事件，用于多个组件间或组件外进行通讯
 * */
export declare function createEvent<Listener extends AnyFunction = AnyFunction>(): {
    /** 以hook的形式注册一个事件监听器，会在unmount时自动解绑事件 */
    useEvent: (listener: Listener) => void;
    /** 注册一个事件监听器 */
    on: (listener: Listener) => void;
    /** 解绑指定的事件监听器 */
    off: (listener: Listener) => void;
    /** 触发所有正在监听的事件 */
    emit: (...args: any) => void;
};
//# sourceMappingURL=useEvent.d.ts.map