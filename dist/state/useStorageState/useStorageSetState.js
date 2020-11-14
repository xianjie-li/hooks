import { useState, useCallback } from 'react';
import { useStorageState, } from '@lxjx/hooks';
export var useStorageSetState = function (
/** 缓存key */
key, 
/** 初始状态 */
initState, 
/** 其他选项 */
options) {
    if (initState === void 0) { initState = {}; }
    var _a = useState(0), update = _a[1];
    var _b = useStorageState(key, initState, options), state = _b[0], set = _b[1];
    var setState = useCallback(function (patch) {
        // 关键是使用Object.assign保证引用不变
        set(Object.assign(state, patch instanceof Function ? patch(state) : patch));
        // 引用相同useState是不会更新的，需要手动触发更新
        update(function (prev) { return prev + 1; });
    }, [set]);
    return [state, setState];
};
//# sourceMappingURL=useStorageSetState.js.map