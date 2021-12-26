import { __spreadArrays } from "tslib";
import { useEffect, useMemo, useRef } from 'react';
import { isArray } from '@lxjx/utils';
import { getTargetDomList, useFn } from '@lxjx/hooks';
var defaultEvents = ['mousedown', 'touchstart'];
export function useClickAway(_a) {
    var target = _a.target, _b = _a.events, events = _b === void 0 ? defaultEvents : _b, onTrigger = _a.onTrigger;
    var ref = useRef();
    var domList = useRef([]);
    var handle = useFn(function (e) {
        if (!domList.current.length)
            return;
        var isInner = domList.current.some(function (dom) {
            return dom.contains(e.target);
        });
        !isInner && onTrigger(e);
    });
    var targetLs = useMemo(function () {
        var r = ref;
        if (!target)
            return [r];
        if (!isArray(target))
            return [target, r];
        return __spreadArrays(target, [r]);
    }, [target, ref.current]);
    useEffect(function () {
        domList.current = getTargetDomList(targetLs) || [];
    }, targetLs);
    useEffect(function () {
        bindHelper();
        return function () { return bindHelper(true); };
    }, events);
    function bindHelper(isOff) {
        if (isOff === void 0) { isOff = false; }
        events.forEach(function (eventKey) {
            document[isOff ? 'removeEventListener' : 'addEventListener'](eventKey, handle);
        });
    }
    return ref;
}
