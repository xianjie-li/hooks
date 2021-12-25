import { __assign, __spreadArrays } from "tslib";
import { useMemo, useState } from 'react';
import { createRandString, isArray } from '@lxjx/utils';
import { createEvent, useUpdateEffect, useUpdate } from '@lxjx/hooks';
/** 所有共享数据 */
var sameMap = {};
/** 所有事件对象 */
var events = {};
var defaultConfig = {
    deps: [],
    enable: true,
};
/** 递增值, 用于存储组件第一次挂载的时间点 */
var increment = 0;
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
 * @param config.deps - [] | 出于性能考虑, 只有组件index变更后才会通知其他组件更新, 设置后, 此数组中的值变更也会触发更新
 * @param config.enable - true | 只有在enable的值为true时，该实例才算启用并被钩子接受, 通常为Modal等组件的toggle参数
 * @return state - 同类型启用组件共享的状态
 * @return state[0] index - 该组件实例处于所有实例中的第几位，未启用的组件返回-1
 * @return state[1] instances - 所有启用状态的组件<Item>组成的数组，正序
 * @return state[2] id - 该组件实例的唯一标识
 * */
export function useSame(key, config) {
    var conf = __assign(__assign({}, defaultConfig), config);
    var id = useMemo(function () { return createRandString(2); }, []);
    var sort = useMemo(function () { return ++increment; }, []);
    var _a = useState(depChangeHandel), cIndex = _a[0], setCIndex = _a[1];
    /* 在某个组件更新了sameMap后，需要通知其他相应的以最新状态更新组件 */
    var update = useUpdate();
    var _b = useMemo(function () { return getEvent(key + "_same_custom_event"); }, []), emit = _b.emit, useEvent = _b.useEvent;
    useEvent(function (_id) {
        // 触发更新的实例和未激活的不更新
        if (_id === id)
            return;
        update();
    });
    /** 保持meta最新 */
    useMemo(function () { return setCurrentMeta(conf.meta); }, [conf.meta]);
    /* enable改变时。更新索引信息 */
    useUpdateEffect(function () {
        setCIndex(depChangeHandel());
    }, [conf.enable]);
    /* cIndex变更时，通知其他钩子进行更新 */
    useUpdateEffect(function () { return emit(id); }, __spreadArrays([cIndex], conf.deps));
    /* 根据enable移除或添加实例并更新其meta, 根据sort排序示例数组后返回组件现在所处id */
    function depChangeHandel() {
        var _a = getCurrent(), current = _a[0], index = _a[1];
        var item = current[index];
        // 执行后续操作前，先移除已有实例
        if (item) {
            current.splice(index, 1);
        }
        // 当依赖值为true时才添加实例到组中
        if (conf.enable) {
            var eItem = item || {
                id: id,
                sort: sort,
                meta: conf.meta || {},
            };
            current.push(eItem);
            setCurrentMeta(conf.meta);
        }
        current.sort(function (a, b) { return a.sort - b.sort; });
        // 从更新后的实例组中获取当前索引
        var _b = getCurrent(), newIndex = _b[1];
        return newIndex;
    }
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
        var _a = getCurrent(), current = _a[0], index = _a[1];
        if (index !== -1) {
            Object.assign(current[index].meta, _meta);
        }
    }
    return [cIndex, sameMap[key], id];
}
