import { useEffect } from 'react';
import { __GLOBAL__ } from '@lxjx/utils';
import { useSelf, useFn } from '@lxjx/hooks';
/**
 * 传入一个函数，经过防抖处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待防抖的函数
 * @param wait - 防抖延迟时间
 * @returns debounceFn - 经过防抖处理后的函数
 * @returns debounceFn.cancel() - 取消防抖调用
 */
export function useDebounce(fn, wait) {
    if (wait === void 0) { wait = 300; }
    var self = useSelf({
        timer: undefined,
    });
    var cancel = useFn(function () {
        if (self.timer) {
            __GLOBAL__.clearTimeout(self.timer);
        }
    });
    useEffect(function () {
        return cancel;
    });
    var memoFn = useFn(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cancel();
        self.timer = __GLOBAL__.setTimeout(function () {
            fn.apply(void 0, args);
            __GLOBAL__.clearTimeout(self.timer);
        }, wait);
    });
    var bundle = Object.assign(memoFn, {
        cancel: cancel,
    });
    return bundle;
}
//# sourceMappingURL=useDebounce.js.map