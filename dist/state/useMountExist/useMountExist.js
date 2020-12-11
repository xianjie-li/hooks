import { useState, useRef, useEffect } from 'react';
import { isNumber } from '@lxjx/utils';
/**
 * 用于便捷的实现mountOnEnter、unmountOnExit接口
 * */
export function useMountExist(_a) {
    var toggle = _a.toggle, _b = _a.mountOnEnter, mountOnEnter = _b === void 0 ? true : _b, unmountOnExit = _a.unmountOnExit, exitDelay = _a.exitDelay;
    var _c = useState(function () {
        // mountOnEnter为false时，强制渲染, 否则取init
        if (!mountOnEnter)
            return true;
        return toggle;
    }), mount = _c[0], set = _c[1];
    var timer = useRef();
    useEffect(function () {
        timer.current && clearTimeout(timer.current);
        if (toggle && mountOnEnter) {
            !mount && set(true);
        }
        if (!toggle && unmountOnExit) {
            if (mount) {
                if (isNumber(exitDelay)) {
                    timer.current = setTimeout(function () {
                        set(false);
                    }, exitDelay);
                }
                else {
                    set(false);
                }
            }
        }
    }, [toggle]);
    return [mount];
}
