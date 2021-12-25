import { useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * - 卸载的准确时机hook内是不能感知的，因为可能中间会存在动画或其他延迟行为，所以需要用户在正确时机调用unmount()通知卸载
 * */
export function useMountState(toggle, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.mountOnEnter, mountOnEnter = _c === void 0 ? true : _c, _d = _b.unmountOnExit, unmountOnExit = _d === void 0 ? false : _d;
    var _e = useState(function () {
        // mountOnEnter为false时，强制渲染, 否则取init
        if (!mountOnEnter)
            return true;
        return toggle;
    }), mount = _e[0], setMount = _e[1];
    // 自动同步true状态, false状态因为可能存在动画等, 由用户手动触发
    useEffect(function () {
        toggle && monkeySet(toggle);
    }, [toggle]);
    var unmount = useFn(function () { return monkeySet(false); });
    function monkeySet(m) {
        // 需要挂载但未挂载时对其进行挂载
        if (m && !mount) {
            setMount(true);
            return;
        }
        // 需要离场卸载且收到卸载通知且当前已挂载
        if (unmountOnExit && !m && mount) {
            setMount(false);
        }
    }
    return [mount, unmount];
}
