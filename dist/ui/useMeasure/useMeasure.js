import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { getRefDomOrDom } from '@lxjx/hooks';
export function useMeasure(target) {
    var ref = useRef(null);
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
    var ro = useState(function () { return new ResizeObserver(function (_a) {
        var entry = _a[0];
        return set(entry.contentRect);
    }); })[0];
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
    return [ref, bounds];
}
