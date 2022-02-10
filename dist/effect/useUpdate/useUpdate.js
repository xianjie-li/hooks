import { useRef, useState } from 'react';
import { useFn } from '@lxjx/hooks';
/**
 * 用于手动触发组件更新, 如果设置了nextTickCall, 多次触发的update会在下一个事件周期统一触发
 * */
export var useUpdate = function (nextTickCall) {
    if (nextTickCall === void 0) { nextTickCall = false; }
    var _a = useState(0), setCount = _a[1];
    var timerRef = useRef();
    var nextTickUpdate = useFn(function () {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(function () {
            setCount(function (prev) { return prev + 1; });
        });
    });
    var update = useFn(function () { return setCount(function (prev) { return prev + 1; }); });
    return nextTickCall ? nextTickUpdate : update;
};
