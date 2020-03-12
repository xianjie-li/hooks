interface Item<Meta = any> {
    /** 改组件的唯一key */
    id: string;
    /** 共享给其他组件的元信息 */
    meta: Meta;
}
/**
 * 用于对同类组件进行管理，获取其他已渲染的同类组件的共享数据以及当前处在启用实例中的位置
 * 一般用例为:
 * - 获取Modal等组件的实例关系，根据组件渲染顺序设置zIndex，隐藏多余的mask等
 * - 对于Drawer等组件，根据渲染顺序调整显示的层级
 * @param key - 用于表示同类组件
 * @param dep - 只有在dep的值为true时，该实例才算启用并被钩子接受, 通常为Modal等组件的toggle参数
 * @param meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
 * @return zIndex[0] - 该组件实例处于所有示例中的第几位，未启用的组件返回-1
 * @return zIndex[1] - 所有启用状态的组件<Item>组成的数组，正序
 * @return zIndex[2] - 该组件实例的唯一标识
 * */
export declare function useSame<Meta = any>(key: string, dep: boolean, meta?: Meta): [number, Item<Meta>[], string];
export {};
