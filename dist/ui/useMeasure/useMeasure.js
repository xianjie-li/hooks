import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash/debounce';
import { getRefDomOrDom, useFn, useIsUnmountState } from '@lxjx/hooks';
/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */
export function useMeasure(target, debounceDelay) {
    var ref = useRef(null);
    var isUnmount = useIsUnmountState();
    var _a = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        right: 0,
        bottom: 0,
    }), bounds = _a[0], set = _a[1];
    var cb = useFn(function (_a) {
        var entry = _a[0];
        !isUnmount() && set(entry.contentRect);
    }, function (fn) {
        if (debounceDelay) {
            return debounce(fn, debounceDelay);
        }
        return fn;
    }, [debounceDelay]);
    var ro = useState(function () { return new ResizeObserver(cb); })[0];
    function getEl() {
        var el = getRefDomOrDom(target);
        if (el)
            return el;
        return ref.current;
    }
    useEffect(function () {
        var el = getEl();
        if (el)
            ro.observe(el);
        return function () { return ro.disconnect(); };
    }, []);
    return [bounds, ref];
}
