import { useRef, useMemo } from 'react';
/**
 * 用于代替`useCallback`，使回调函数的引用地址永久不变, 从而减少消费组件不必要的更新。
 * 该hook的另一个用例是解决闭包导致的回调内外状态不一致问题，并且它不需要传递`deps`参数
 * @param fn - 需要`memo`化的函数
 * @param wraper - 接收fn并返回，可以藉此对函数实现节流等增强操作, 只在初始化和deps改变时调用
 * @param deps - 依赖数组，如果传入，其中任意值改变都会重载缓存的fn，可以用来更新wraper包装的函数
 * @returns - 经过memo化的函数
 */
export function useFn(fn, wraper, deps) {
    if (deps === void 0) { deps = []; }
    var fnRef = useRef();
    var memoFnRef = useRef(null);
    // 更新缓存fn
    useMemo(function () {
        if (!memoFnRef.current)
            return;
        wrapFn();
    }, deps);
    // 初始化缓存fn
    if (!memoFnRef.current)
        wrapFn();
    /** 兼容devtool，直接写fnRef.current会阻断更新 */
    useMemo(function () {
        fnRef.current = fn;
    });
    function wrapFn() {
        function memoFn() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fnRef.current.apply(this, args);
        }
        memoFnRef.current = wraper ? wraper(memoFn) : memoFn;
    }
    return memoFnRef.current;
}
//# sourceMappingURL=useFn.js.map