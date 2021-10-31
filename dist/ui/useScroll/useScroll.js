import { __assign } from "tslib";
import { useEffect, useRef } from 'react';
import { isNumber, isDom } from '@lxjx/utils';
import _clamp from 'lodash/clamp';
import { getRefDomOrDom, useSelf, useThrottle } from '@lxjx/hooks';
import { useSpring, config } from 'react-spring';
export function useScroll(_a) {
    var _b = _a === void 0 ? {} : _a, el = _b.el, onScroll = _b.onScroll, _c = _b.throttleTime, throttleTime = _c === void 0 ? 100 : _c, _d = _b.offset, offset = _d === void 0 ? 0 : _d, offsetX = _b.offsetX, offsetY = _b.offsetY, _e = _b.touchOffset, touchOffset = _e === void 0 ? 0 : _e;
    // 用于返回的节点获取ref
    var ref = useRef(null);
    // 获取documentElement和body, 放到useEffect以兼容SSR
    var self = useSelf({
        docEl: null,
        bodyEl: null,
    });
    var _f = useSpring(function () { return ({
        y: 0,
        x: 0,
        config: __assign({ clamp: true }, config.stiff),
    }); }), spValue = _f[0], spApi = _f[1];
    /** 滚动处理 */
    var scrollHandle = useThrottle(function () {
        onScroll && onScroll(get());
    }, throttleTime);
    /** 初始化获取根节点 */
    useEffect(function () {
        self.docEl = document.documentElement;
        self.bodyEl = document.body;
    }, []);
    /** 绑定滚动事件 */
    useEffect(function () {
        var sEl = getEl();
        /* 坑: 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上 */
        var scrollEl = elIsDoc(sEl) ? window : sEl;
        scrollEl.addEventListener('scroll', scrollHandle);
        return function () {
            scrollEl.removeEventListener('scroll', scrollHandle);
        };
    }, [el, ref.current]);
    /** 执行滚动、拖动操作时，停止当前正在进行的滚动操作 */
    useEffect(function () {
        var sEl = getEl();
        function wheelHandle() {
            if (spValue.x.isAnimating || spValue.y.isAnimating) {
                // @ts-ignore
                spApi.stop();
            }
        }
        sEl.addEventListener('wheel', wheelHandle);
        sEl.addEventListener('touchmove', wheelHandle);
        return function () {
            sEl.removeEventListener('wheel', wheelHandle);
            sEl.removeEventListener('touchmove', wheelHandle);
        };
    }, [el, ref.current]);
    /** 检测元素是否是body或html节点 */
    function elIsDoc(_el) {
        var sEl = _el || getEl();
        return sEl === self.docEl || sEl === self.bodyEl;
    }
    /** 根据参数获取滚动元素，默认为文档元素 */
    function getEl() {
        return getRefDomOrDom(el, ref) || self.docEl;
    }
    /** 动画滚动到指定位置 */
    function animateTo(sEl, next, now) {
        var isDoc = elIsDoc(sEl);
        spApi(__assign(__assign({}, next), { from: now, onChange: function (result) {
                var x = result.value.x;
                var y = result.value.y;
                if (isDoc) {
                    setDocPos(x, y);
                }
                else {
                    sEl.scrollTop = y;
                    sEl.scrollLeft = x;
                }
            } }));
    }
    /** 根据传入的x、y值设置滚动位置 */
    function set(_a) {
        var x = _a.x, y = _a.y, raise = _a.raise, immediate = _a.immediate;
        var scroller = getEl();
        var _b = get(), xMax = _b.xMax, yMax = _b.yMax, oldX = _b.x, oldY = _b.y;
        var nextPos = {};
        var nowPos = {
            x: oldX,
            y: oldY,
        };
        if (isNumber(x)) {
            var nextX = x;
            if (raise) {
                nextX = _clamp(oldX + x, 0, xMax);
            }
            if (nextX !== oldX) {
                nextPos.x = nextX;
            }
        }
        if (isNumber(y)) {
            var nextY = y;
            if (raise) {
                nextY = _clamp(oldY + y, 0, yMax);
            }
            if (nextY !== oldY) {
                nextPos.y = nextY;
            }
        }
        if ('x' in nextPos || 'y' in nextPos) {
            var isDoc = elIsDoc(scroller);
            if (immediate) {
                if (isNumber(nextPos.x)) {
                    if (isDoc) {
                        setDocPos(nextPos.x);
                    }
                    else {
                        scroller.scrollLeft = nextPos.x;
                    }
                }
                if (isNumber(nextPos.y)) {
                    if (isDoc) {
                        setDocPos(undefined, nextPos.y);
                    }
                    else {
                        scroller.scrollTop = nextPos.y;
                    }
                }
            }
            else {
                animateTo(scroller, nextPos, nowPos);
            }
        }
    }
    function scrollToElement(arg, immediate) {
        var sEl = getEl();
        var isDoc = elIsDoc(sEl);
        var targetEl;
        if (!sEl.getBoundingClientRect) {
            console.warn('The browser does not support `getBoundingClientRect` API');
            return;
        }
        if (typeof arg === 'string') {
            targetEl = getEl().querySelector(arg);
        }
        else {
            targetEl = arg;
        }
        if (!isDom(targetEl))
            return;
        var _a = targetEl.getBoundingClientRect(), cTop = _a.top, cLeft = _a.left;
        var _b = sEl.getBoundingClientRect(), fTop = _b.top, fLeft = _b.left;
        /**
         * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
         * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
         * */
        var xOffset = offsetX || offset;
        var yOffset = offsetY || offset;
        set({
            x: cLeft - fLeft + xOffset,
            y: cTop - fTop + yOffset,
            raise: !isDoc,
            immediate: immediate,
        });
    }
    /** 获取各种有用的滚动信息 */
    function get() {
        var isDoc = elIsDoc();
        var sEl = getEl();
        var x = isDoc ? self.docEl.scrollLeft + self.bodyEl.scrollLeft : sEl.scrollLeft;
        var y = isDoc ? self.docEl.scrollTop + self.bodyEl.scrollTop : sEl.scrollTop;
        /* chrome高分屏+缩放时，滚动值会是小数，想上取整防止计算错误 */
        x = Math.ceil(x);
        y = Math.ceil(y);
        var height = sEl.clientHeight;
        var width = sEl.clientWidth;
        var scrollHeight = sEl.scrollHeight;
        var scrollWidth = sEl.scrollWidth;
        /* chrome下(高分屏+缩放),无滚动的情况下scrollWidth会大于width */
        var xMax = Math.max(0, scrollWidth - width);
        var yMax = Math.max(0, scrollHeight - height);
        return {
            el: sEl,
            x: x,
            y: y,
            xMax: xMax,
            yMax: yMax,
            height: height,
            width: width,
            scrollHeight: scrollHeight,
            scrollWidth: scrollWidth,
            touchBottom: yMax - y - touchOffset <= 0,
            touchLeft: x <= touchOffset,
            touchRight: xMax - x - touchOffset <= 0,
            touchTop: y <= touchOffset,
            offsetWidth: sEl.offsetWidth,
            offsetHeight: sEl.offsetHeight,
        };
    }
    /** 设置根级的滚动位置 */
    function setDocPos(x, y) {
        if (isNumber(x)) {
            // 只有一个会生效
            self.bodyEl.scrollLeft = x;
            self.docEl.scrollLeft = x;
        }
        if (isNumber(y)) {
            self.bodyEl.scrollTop = y;
            self.docEl.scrollTop = y;
        }
    }
    return {
        set: set,
        get: get,
        scrollToElement: scrollToElement,
        ref: ref,
    };
}
