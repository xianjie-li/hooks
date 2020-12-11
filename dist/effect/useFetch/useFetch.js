import { __assign, __awaiter, __generator, __spreadArrays } from "tslib";
import { __GLOBAL__, isEmpty, isFunction, isObject } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';
import { useEffectEqual, useFn, useSelf, useSetState, useStorageState, } from '@lxjx/hooks';
var GLOBAL = __GLOBAL__;
/** 简单的判断是否为合成事件 */
function isSyntheticEvent(arg) {
    if (!arg)
        return false;
    return isObject(arg) && 'nativeEvent' in arg && 'target' in arg && 'type' in arg;
}
function useFetch(
/** 一个Promise return函数或async函数, 当不为函数时不会走请求流程 */
method, 
/** 配置项 */
options) {
    if (options === void 0) { options = {}; }
    var self = useSelf({
        /** 请求的唯一标示，在每一次请求开始前更新，并作为请求有效性的凭据 */
        fetchID: 0,
        /** 完成请求次数 */
        fetchCount: 0,
        /** 超时计时器 */
        timeoutTimer: 0,
        /** 处理轮询状态 */
        lastFetch: Date.now(),
    });
    var initData = options.initData, initPayload = options.initPayload, _a = options.deps, deps = _a === void 0 ? [] : _a, param = options.param, _b = options.manual, manual = _b === void 0 ? false : _b, _c = options.timeout, timeout = _c === void 0 ? 10000 : _c, onSuccess = options.onSuccess, onError = options.onError, onComplete = options.onComplete, onTimeout = options.onTimeout, cacheKey = options.cacheKey, _d = options.stale, stale = _d === void 0 ? true : _d, throttleInterval = options.throttleInterval, debounceInterval = options.debounceInterval, pollingInterval = options.pollingInterval, _e = options.pass, aPass = _e === void 0 ? true : _e;
    var isCache = !!cacheKey; // 包含用于缓存的key并且非isPost时，缓存才会生效
    var pass = aPass && isFunction(method);
    var _f = useSetState({
        loading: !manual && pass,
        error: undefined,
        timeout: false,
    }), state = _f[0], setState = _f[1];
    // 防止卸载后赋值
    useEffect(function () {
        return function () {
            self.fetchID = 0; // 超时后阻止后续赋值操作
            self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
        };
    }, []);
    var _g = useStorageState(cacheKey + "_FETCH_PAYLOAD", initPayload, {
        disabled: !isCache,
    }), payload = _g[0], setPayload = _g[1];
    var _h = useStorageState(cacheKey + "_FETCH_DATA", initData, {
        disabled: !isCache,
    }), data = _h[0], setData = _h[1];
    var _j = useState(true), polling = _j[0], setPolling = _j[1];
    var fetchHandel = useFn(function _fetchHandel(args, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var cID, cTimeoutTimer, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pass) {
                            return [2 /*return*/, [new Error('the request has been ignored'), null]];
                        }
                        self.lastFetch = Date.now();
                        cID = Math.random();
                        self.fetchID = cID;
                        // 清除上一个计时器
                        self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
                        self.timeoutTimer = GLOBAL.setTimeout(function () {
                            cancel();
                            onTimeout === null || onTimeout === void 0 ? void 0 : onTimeout();
                            setState(__assign({}, getResetState('timeout', true)));
                        }, timeout);
                        cTimeoutTimer = self.timeoutTimer;
                        // 减少更新次数
                        if (!state.loading) {
                            setState(__assign({}, getResetState('loading', true)));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, method(args)];
                    case 2:
                        res = _a.sent();
                        if (cID === self.fetchID) {
                            setState(__assign({}, getResetState('loading', false)));
                            setData(res);
                            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(res, isUpdate);
                            return [2 /*return*/, [undefined, res]];
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        if (cID === self.fetchID) {
                            setState(__assign({}, getResetState('error', err_1)));
                            onError === null || onError === void 0 ? void 0 : onError(err_1);
                            return [2 /*return*/, [err_1, undefined]];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        // 清理当前计时器
                        cTimeoutTimer && GLOBAL.clearTimeout(cTimeoutTimer);
                        if (cID === self.fetchID) {
                            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
                            self.fetchCount++;
                        }
                        return [7 /*endfinally*/];
                    case 5: 
                    // 仅用于保证类型正确
                    return [2 /*return*/, [new Error('never execute'), null]];
                }
            });
        });
    }, function (fn) {
        if (throttleInterval) {
            return _throttle(fn, throttleInterval, { trailing: false }); // 对于请求，应该禁止尾随调用
        }
        if (debounceInterval) {
            return _debounce(fn, debounceInterval);
        }
        return fn;
    });
    /** 手动发起请求 */
    var send = useFn(function (newPayload) {
        var isUpdate = isSyntheticEvent(newPayload) || newPayload === undefined;
        return fetchHandel(getActualPayload(newPayload), isUpdate);
    });
    /** 监听param改变并执行缓存更新，发起请求 */
    useEffectEqual(function () {
        if (!('param' in options))
            return;
        if (self.fetchCount === 0 || manual)
            return;
        fetchHandel(getActualPayload(), false); // 走到这里说明参数已经改变了
    }, [param]);
    /** 执行一些自动触发请求的操作 */
    useEffect(function () {
        if (manual || !pass)
            return;
        // 初次请求时，如果有数据且禁用了stale，取消请求
        if (!stale && self.fetchCount === 0 && !isEmpty(data)) {
            setState({
                loading: false,
            });
            return;
        }
        fetchHandel(getActualPayload(), self.fetchCount !== 0);
    }, __spreadArrays([pass], deps));
    /** 轮询处理 */
    useEffect(function intervalHandle() {
        var timer;
        if (polling && pollingInterval && pollingInterval > 500) {
            timer = GLOBAL.setInterval(function () {
                var now = Date.now();
                var last = self.lastFetch;
                var reFetch = now - last >= pollingInterval;
                reFetch && send();
            }, pollingInterval);
        }
        return function () {
            timer && clearInterval(timer);
        };
    }, [pollingInterval, polling]);
    /** 接受可选的新payload，并根据条件返回传递给fetchHandel的参数(使用param或payload) */
    function getActualPayload(newPayload) {
        // 包含param配置项，使用当前param更新
        if ('param' in options) {
            return param;
        }
        // 参数为合成事件或未传，视为更新请求，使用当前payload进行更新请求
        if (isSyntheticEvent(newPayload) || newPayload === undefined) {
            return payload;
        }
        // 包含新的payload，更新payload值并使用新的payload更新请求
        setPayload(newPayload); // 同步新的payload
        return newPayload;
    }
    /** 返回一个将互斥的状态还原的对象，并通过键值覆盖设置某个值 */
    function getResetState(key, value) {
        var resetState = {
            loading: false,
            error: undefined,
            timeout: false,
        };
        if (key) {
            resetState[key] = value;
        }
        return resetState;
    }
    /** 取消请求 */
    function cancel() {
        self.fetchID = 0; // 超时后阻止后续赋值操作
        self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
        setState({
            loading: false,
        });
    }
    return __assign(__assign({}, state), { send: send,
        data: data,
        payload: payload,
        param: param,
        setData: setData,
        cancel: cancel,
        polling: polling,
        setPolling: setPolling });
}
export { useFetch };
