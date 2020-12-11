import { __assign } from "tslib";
import { useState, useCallback, useRef } from 'react';
/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 * */
export var useSetState = function (initState) {
    if (initState === void 0) { initState = {}; }
    var _a = useState(initState), state = _a[0], set = _a[1];
    var ref = useRef(state);
    var setState = useCallback(function (patch) {
        var newState = __assign(__assign({}, state), (patch instanceof Function ? patch(ref.current) : patch));
        ref.current = Object.assign(ref.current, newState);
        set(newState);
    }, [set]);
    return [ref.current, setState];
};
