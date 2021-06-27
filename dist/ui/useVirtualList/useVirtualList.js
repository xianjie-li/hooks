import { useEffect, useMemo, useRef } from 'react';
import { isFunction } from '@lxjx/utils';
import { createEvent, getRefDomOrDom, useFn, useScroll, useSelf, useSetState, } from '@lxjx/hooks';
import _debounce from 'lodash/debounce';
export function useVirtualList(option) {
    var list = option.list, size = option.size, _a = option.overscan, overscan = _a === void 0 ? 5 : _a, key = option.key, _b = option.space, space = _b === void 0 ? 0 : _b, keepAlive = option.keepAlive, containerTarget = option.containerTarget;
    var wrapRef = useRef(null);
    // 统一通知Render更新状态
    var updateEvent = useMemo(function () { return createEvent(); }, []);
    var self = useSelf({
        scrolling: false,
    });
    var _c = useMemo(function () {
        var h = 0;
        var ls = list.map(function (item, index) {
            var _size = getSize(item, index);
            h += _size;
            return {
                data: item,
                index: index,
                key: getKey(item, index),
                position: h,
                size: _size,
            };
        });
        return [ls, h];
    }, [list]), fmtList = _c[0], height = _c[1];
    var scroller = useScroll({
        el: containerTarget,
        throttleTime: 0,
        onScroll: handleScroll,
    });
    /** 使用render组件来减少hook对消费组件的频繁更新 */
    var Render = useMemo(function () { return function (_a) {
        var children = _a.children;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var _b = useSetState({
            list: [],
            scrolling: false,
        }), state = _b[0], setState = _b[1];
        updateEvent.useEvent(setState);
        return children(state);
    }; }, []);
    useEffect(function () {
        if (!getRefDomOrDom(option.wrapRef, wrapRef) || !scroller.ref.current) {
            throw Error('useVirtualList(...) -> wrap or container is not gets');
        }
    }, []);
    useEffect(function () {
        handleScroll(scroller.get());
        scroller.ref.current && (scroller.ref.current.style.overflowY = 'auto');
    }, []);
    // 通知滚动结束
    var emitScrolling = useFn(function () {
        self.scrolling = false;
        updateEvent.emit({
            scrolling: false,
        });
    }, function (fn) { return _debounce(fn, 100); });
    /** 核心混动逻辑 */
    function handleScroll(meta) {
        // 通知滚动开始
        if (!self.scrolling) {
            self.scrolling = true;
            updateEvent.emit({
                scrolling: true,
            });
        }
        emitScrolling();
        // keep列表需要实时计算
        var keepAliveList = [];
        var wrapEl = getRefDomOrDom(option.wrapRef, wrapRef);
        if (!wrapEl || !meta.el)
            return;
        if (keepAlive) {
            keepAliveList = fmtList.filter(function (item, index) { return keepAlive(item.data, index); });
        }
        // 开始索引
        var start = 0;
        // 计算开始索引
        for (var i = 0; i < fmtList.length; i++) {
            var position = fmtList[i].position;
            start = i;
            if (position > meta.y)
                break;
        }
        // 计算结束索引
        var contHeight = 0;
        var end = start;
        for (var i = 0; i < fmtList.length; i++) {
            if (contHeight > meta.el.offsetHeight || end >= fmtList.length)
                break;
            contHeight += fmtList[end].size;
            end += 1;
        }
        if (overscan) {
            var _a = getOverscanSize(start, end), nextStart = _a[0], nextEnd = _a[1];
            start = nextStart;
            end = nextEnd;
        }
        var nextList = fmtList.slice(start, end);
        if (keepAliveList.length) {
            keepAliveList.forEach(function (item) {
                var has = nextList.find(function (it) { return it.key === item.key; });
                if (!has) {
                    if (item.index < start)
                        nextList.unshift(item);
                    else
                        nextList.push(item);
                }
            });
        }
        // 顶部偏移
        var top = 0;
        for (var i = 0; i < start; i++) {
            top += fmtList[i].size;
        }
        var h = height - top + space + "px";
        var t = top + "px";
        // 设置wrap样式
        if (wrapEl.style.cssText !== undefined) {
            wrapEl.style.cssText = "margin-top: " + t + ";height: " + h + ";";
        }
        else {
            wrapEl.style.marginTop = t;
            wrapEl.style.height = h;
        }
        updateEvent.emit({ list: nextList });
    }
    /** 将开始和结束索引根据overscan进行修正，参数3会返回顶部应减少的偏移 */
    function getOverscanSize(start, end) {
        var nextStart = Math.max(start - overscan, 0);
        var nextEnd = Math.min(
        /* 索引为0时不添加 */
        end + overscan /* slice是尾闭合的，所以要多取一位 */, fmtList.length);
        return [nextStart, nextEnd];
    }
    function getSize(item, index) {
        if (!isFunction(size))
            return size;
        return size(item, index);
    }
    function getKey(item, index) {
        if (!isFunction(key))
            return String(index);
        return key(item, index);
    }
    return {
        containerRef: scroller.ref,
        wrapRef: wrapRef,
        Render: Render,
    };
}
