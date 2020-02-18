/// <reference types="react" />
interface UseScrollOptions {
    /** 直接以指定dom作为滚动元素，优先级高于default，低于ref */
    el?: HTMLElement;
    /** 滚动时触发 */
    onScroll?(meta: UseScrollMeta): void;
    /** 100 | 配置了onScroll时，设置throttle时间, 单位(ms) */
    throttleTime?: number;
    /** 0 | 滚动偏移值, 使用scrollToElement时，会根据此值进行修正 */
    offset?: number;
    /** y轴的偏移距离，优先级高于offset */
    offsetX?: number;
    /** x轴的偏移距离，优先级高于offset */
    offsetY?: number;
}
interface UseScrollSetArg {
    /** 指定滚动的x轴 */
    x?: number;
    /** 指定滚动的y轴 */
    y?: number;
    /** 以当前滚动位置为基础进行增减滚动 */
    raise?: boolean;
    /** 为true时阻止动画 */
    immediate?: boolean;
}
interface UseScrollMeta {
    /** 滚动元素 */
    el: HTMLElement;
    /** x轴位置 */
    x: number;
    /** y轴位置 */
    y: number;
    /** 可接受的x轴滚动最大值 */
    xMax: number;
    /** 可接受的y轴滚动最大值 */
    yMax: number;
    /** 元素高度 */
    height: number;
    /** 元素宽度 */
    width: number;
    /** 元素总高度 */
    scrollHeight: number;
    /** 元素总宽度 */
    scrollWidth: number;
    /** 滚动条位于最底部 */
    touchBottom: boolean;
    /** 滚动条位于最右侧 */
    touchRight: boolean;
    /** 滚动条位于最顶部 */
    touchTop: boolean;
    /** 滚动条位于最左侧 */
    touchLeft: boolean;
}
export declare function useScroll<ElType extends HTMLElement>({ el, onScroll, throttleTime, offset, offsetX, offsetY, }?: UseScrollOptions): {
    set: ({ x, y, raise, immediate }: UseScrollSetArg) => void;
    get: () => UseScrollMeta;
    scrollToElement: {
        (selector: string): void;
        (element: HTMLElement): void;
    };
    ref: import("react").RefObject<ElType>;
};
export {};
