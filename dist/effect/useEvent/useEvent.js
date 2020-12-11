import { useFn } from '@lxjx/hooks';
import { useEffect } from 'react';
/**
 * 自定义事件，用于多个组件间或组件外进行通讯
 * */
export function createEvent() {
    var listeners = [];
    var useEvent = function (listener) {
        var memoHandle = useFn(listener);
        useEffect(function () {
            on(memoHandle);
            return function () { return off(memoHandle); };
        }, []);
    };
    function on(listener) {
        listeners.push(listener);
    }
    function off(listener) {
        var ind = listeners.indexOf(listener);
        if (ind !== -1)
            listeners.splice(ind, 1);
    }
    function emit() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        listeners.forEach(function (listener) { return listener.apply(void 0, args); });
    }
    return {
        /** 以hook的形式注册一个事件监听器，会在unmount时自动解绑事件 */
        useEvent: useEvent,
        /** 注册一个事件监听器 */
        on: on,
        /** 解绑指定的事件监听器 */
        off: off,
        /** 触发所有正在监听的事件 */
        emit: emit,
    };
}
