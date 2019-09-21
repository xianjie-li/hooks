/** 返回类似类组件的this的实例属性 */
export declare function useSelf<T>(init?: T): T;
/** 与useEffect参数一致，区别是不会在初次渲染时触发 */
export declare function useUpdate(didUpdate: () => (void | (() => (void | undefined))), source?: any[]): void;
export declare function useLegacyState<T>(init: T & object): readonly [T, (SetStateAction: T | ((prev: T) => T)) => void];
