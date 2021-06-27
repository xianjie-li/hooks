import { useEffect, useMemo, useRef } from 'react';
import { createRandString, getScrollBarWidth } from '@lxjx/utils';
var scrollPosition = 0; // 保存锁定时的滚动位置
var list = [];
/**
 * 锁定滚动条并对滚动条宽度进行修正
 * @param locked - 根据传入值对滚动条进行锁定/解锁
 * */
export var useLockBodyScroll = function (locked) {
    var id = useMemo(function () { return createRandString(); }, []);
    var instance = useRef({
        bodyEl: null,
        scrollBarWidth: 0,
    });
    useEffect(function () {
        instance.current.bodyEl = document.body;
        instance.current.scrollBarWidth = getScrollBarWidth();
    }, []);
    // 存取list
    useEffect(function () {
        if (locked) {
            list.push(id);
            if (list.length === 1)
                lock();
        }
        return function () {
            if (!locked)
                return;
            var ind = list.indexOf(id);
            if (ind !== -1)
                list.splice(ind, 1);
            if (!list.length)
                unlock();
        };
    }, [locked]);
    function lock() {
        var bodyEl = instance.current.bodyEl;
        var scrollBarWidth = instance.current.scrollBarWidth;
        bodyEl.setAttribute('data-locked', '1');
        scrollPosition = window.pageYOffset;
        bodyEl.style.width = "calc(100% - " + scrollBarWidth + "px)";
        bodyEl.style.overflow = 'hidden';
        bodyEl.style.position = 'fixed';
        bodyEl.style.top = "-" + scrollPosition + "px";
    }
    function unlock() {
        var bodyEl = instance.current.bodyEl;
        bodyEl.setAttribute('data-locked', '0');
        bodyEl.style.width = '';
        bodyEl.style.overflow = '';
        bodyEl.style.position = '';
        bodyEl.style.top = '';
        window.scrollTo(0, scrollPosition);
    }
};
