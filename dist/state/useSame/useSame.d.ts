/** 单个组件实例 */
interface Item<Meta = any> {
    /** 该组件的唯一key */
    id: string;
    /** 该组件的递增值, 用于排序, 组件挂载得越早, 值越小 */
    sort: number;
    /** 该组件需要共享给其他组件的元信息 */
    meta: Meta;
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
export declare function useSame<Meta = any>(key: string, config?: {
    meta?: Meta;
    deps?: any[];
    enable?: boolean;
}): [number, Item<Meta>[], string];
export {};
//# sourceMappingURL=useSame.d.ts.map