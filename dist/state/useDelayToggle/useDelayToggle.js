/**
 * 将转入的开关状态在指定延迟后转为本地状态并在变更后同步
 * */
import { useState, useEffect } from 'react';
import { useSelf } from '@lxjx/hooks';
export function useDelayToggle(toggle, delay, options) {
    if (delay === void 0) { delay = 300; }
    var _a = options || {}, disabled = _a.disabled, _b = _a.leadingDelay, leadingDelay = _b === void 0 ? delay : _b, _c = _a.trailingDelay, trailingDelay = _c === void 0 ? delay : _c, trailing = _a.trailing, _d = _a.leading, leading = _d === void 0 ? true : _d;
    var isDisabled = !delay || disabled || (!trailing && !leading);
    // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
    var _e = useState(toggle), innerState = _e[0], setInnerState = _e[1];
    var self = useSelf({
        toggleTimer: null,
    });
    useEffect(function () {
        if (isDisabled)
            return;
        if ((toggle && !leading) || (!toggle && !trailing)) {
            toggle !== innerState && setInnerState(toggle);
            return;
        }
        var d = toggle ? leadingDelay : trailingDelay;
        self.toggleTimer = setTimeout(function () {
            setInnerState(toggle);
        }, d);
        return function () {
            self.toggleTimer && clearTimeout(self.toggleTimer);
        };
    }, [toggle]);
    return isDisabled ? toggle : innerState;
}
