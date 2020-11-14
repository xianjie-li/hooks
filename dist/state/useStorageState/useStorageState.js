import { __assign } from "tslib";
import { useFn } from '@lxjx/hooks';
import { __GLOBAL__ } from '@lxjx/utils';
import { useState } from 'react';
var BASE_KEY = 'USE_STORAGE_CACHE';
var storagMethod = {
    local: __GLOBAL__.localStorage,
    session: __GLOBAL__.sessionStorage,
};
function setStorage(key, val, type) {
    if (type === void 0) { type = 'session'; }
    if (val === undefined)
        return;
    var method = storagMethod[type];
    if (!method)
        return;
    method.setItem(BASE_KEY + "_" + key.toUpperCase(), JSON.stringify(val));
}
function getStorage(key, type) {
    if (type === void 0) { type = 'session'; }
    var method = storagMethod[type];
    if (!method)
        return;
    var cache = method.getItem(BASE_KEY + "_" + key.toUpperCase());
    return cache === null ? cache : JSON.parse(cache);
}
function remove(key, type) {
    if (type === void 0) { type = 'session'; }
    var method = storagMethod[type];
    if (!method)
        return;
    method.removeItem(BASE_KEY + "_" + key.toUpperCase());
}
var defaultOptions = {
    type: 'session',
    disabled: false,
};
function useStorageBase(
/** 缓存key */
key, 
/** 初始状态 */
initState, 
/** 其他选项 */
options) {
    var opt = __assign(__assign({}, defaultOptions), options);
    var _a = useState(function () {
        if (!opt.disabled) {
            var cache = getStorage(key, opt.type);
            if (cache !== null) {
                // null以外的值都视为缓存
                return cache;
            }
        }
        if (initState instanceof Function) {
            var _initState = initState();
            !opt.disabled && setStorage(key, _initState, opt.type);
            return _initState;
        }
        !opt.disabled && setStorage(key, initState, opt.type);
        return initState;
    }), state = _a[0], setState = _a[1];
    var memoSetState = useFn(function (patch) {
        if (patch instanceof Function) {
            setState(function (prev) {
                var patchRes = patch(prev);
                !opt.disabled && setStorage(key, patchRes, opt.type);
                return patchRes;
            });
        }
        else {
            !opt.disabled && setStorage(key, patch, opt.type);
            setState(patch);
        }
    });
    return [state, memoSetState];
}
export var useStorageState = Object.assign(useStorageBase, {
    get: getStorage,
    set: setStorage,
    remove: remove,
});
//# sourceMappingURL=useStorageState.js.map