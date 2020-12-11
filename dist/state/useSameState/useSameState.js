import { __assign, __spreadArrays } from "tslib";
import { useEffect, useMemo, useState } from 'react';
import { createRandString, isArray } from '@lxjx/utils';
import { useUpdateEffect, useUpdate } from 'react-use';
import { createEvent } from '@lxjx/hooks';
/** 所有共享数据 */
var sameMap = {};
/** 所有事件对象 */
var events = {};
var defaultConfig = {
    deps: [],
    enable: true,
};
/** 以指定key获取事件对象，不存在时创建并返回 */
function getEvent(key) {
    var e = events[key];
    if (e)
        return e;
    events[key] = createEvent();
    return events[key];
}
/**
 * 用于对同组件的不同实例进行管理，获取其他已渲染组件的共享数据以及当前处在启用实例中的顺序
 *
 * `常见用例有`:
 * - 获取Modal等组件的实例关系，根据组件渲染顺序设置zIndex，隐藏多余的mask等
 * - 对于Drawer等组件，根据渲染顺序调整显示的层级
 * @param key - 标识该组件的唯一key
 * @param config - 额外配置
 * @param config.meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
 * @param config.deps - [] | 出于性能考虑，各组件共享的meta只在该实例index变更时更新，可以通过此项传入依赖项数组在任意一个依赖变更后更新meta
 * @param config.enable - true | 只有在dep的值为true时，该实例才算启用并被钩子接受, 通常为Modal等组件的toggle参数
 * @return state - 同类型启用组件共享的状态
 * @return state[0] index - 该组件实例处于所有实例中的第几位，未启用的组件返回-1
 * @return state[1] instances - 所有启用状态的组件<Item>组成的数组，正序
 * @return state[2] id - 该组件实例的唯一标识
 * */
export function useSameState(key, config) {
    var _a;
    var conf = __assign(__assign({}, defaultConfig), config);
    var id = useMemo(function () { return createRandString(2); }, []);
    var _b = useState(depChangeHandel), cIndex = _b[0], setCIndex = _b[1];
    /* 在某个组件更新了sameMap后，需要通知其他相应的以最新状态更新组件 */
    var update = useUpdate();
    var _c = getEvent(key + "_same_custom_event"), emit = _c.emit, useEvent = _c.useEvent;
    useEvent(function (_id) {
        // 触发更新的实例和未激活的不更新
        if (_id === id)
            return;
        update();
    });
    setCurrentMeta(conf.meta);
    /* 获取当前实例在实例组中的索引或添加当前实例到实例组中，未启用组件索引返回-1 */
    function depChangeHandel() {
        var _a = getCurrent(), current = _a[0], index = _a[1];
        // 执行后续操作前，先移除已有实例
        if (index !== -1) {
            current.splice(index, 1);
        }
        // 当依赖值为true时才添加实例到组中
        if (conf.enable) {
            sameMap[key].push({
                id: id,
                meta: conf.meta || {},
            });
        }
        // 从更新后的实例组中获取当前索引
        var _b = getCurrent(), newIndex = _b[1];
        return newIndex;
    }
    /* dep改变时。更新索引信息 */
    useUpdateEffect(function () {
        setCIndex(depChangeHandel());
    }, [conf.enable]);
    /* cIndex变更时，通知其他钩子进行更新 */
    useUpdateEffect(function () {
        emit(id);
    }, __spreadArrays([cIndex], conf.deps));
    /**
     * 获取当前组件在sameMap中的实例组和该组件在实例中的索引并确保sameMap[key]存在
     * @return meta[0] - 该组件实例组成的数组
     * @return meta[1] - 当前组件在实例中的位置
     * */
    function getCurrent() {
        // 无实例存在时赋初始值
        if (!isArray(sameMap[key])) {
            sameMap[key] = [];
        }
        // 取所在索引
        var index = sameMap[key].findIndex(function (item) { return item.id === id; });
        return [sameMap[key], index];
    }
    /* 设置当前实例的meta状态 */
    function setCurrentMeta(_meta) {
        if (typeof _meta === 'undefined')
            return;
        var _a = getCurrent(), current = _a[0], index = _a[1];
        if (index !== -1) {
            current[index].meta = _meta;
        }
    }
    /* 在sameMap[key]长度改变时/deps变更时更新 */
    useEffect(function () {
        var _a = getCurrent(), newIndex = _a[1];
        if (newIndex !== cIndex) {
            setCIndex(newIndex);
        }
        // eslint-disable-next-line
    }, [(_a = sameMap[key]) === null || _a === void 0 ? void 0 : _a.length]);
    return [cIndex, sameMap[key], id];
}
