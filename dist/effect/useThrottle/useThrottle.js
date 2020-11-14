import { __assign } from "tslib";
import { useEffect } from 'react';
import { __GLOBAL__ } from '@lxjx/utils';
import { useFn, useSelf } from '@lxjx/hooks';
var defaultOption = {
    leading: true,
    trailing: true,
};
/**
 * 传入一个函数，经过节流处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待节流的函数
 * @param wait - 节流延迟时间
 * @param options
 * @param options.leading - true | 在节流开始前调用
 * @param options.trailing - true | 在节流结束后调用
 * @returns throttleFn - 经过节流处理后的函数
 * @returns throttleFn.cancel() - 取消节流调用
 */
export function useThrottle(fn, wait, options) {
    if (wait === void 0) { wait = 300; }
    var self = useSelf({
        last: 0,
        timer: undefined,
    });
    var opt = __assign(__assign({}, defaultOption), options);
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
        var now = Date.now();
        var diff = now - self.last;
        cancel();
        if (diff > wait) {
            // last = 0 时视为初次调用
            if (opt.leading || self.last !== 0) {
                fn.apply(void 0, args);
            }
            self.last = now;
        }
        else if (opt.trailing) {
            self.timer = __GLOBAL__.setTimeout(function () {
                fn.apply(void 0, args);
                self.last = 0; // 标记下次调用为leading调用
                __GLOBAL__.clearTimeout(self.timer);
            }, wait);
        }
    });
    var bundle = Object.assign(memoFn, {
        cancel: cancel,
    });
    return bundle;
}
//# sourceMappingURL=useThrottle.js.map