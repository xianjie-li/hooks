import { SetStateAction, Dispatch } from 'react';
declare function setSessionState(key: string, beCache: any): void;
declare function getSessionState(key: string): any;
export interface UseSessionStateOptions {
    /** false | 是否启用缓存 */
    disable?: boolean;
}
/**
 * 与useState一致，区别是会在缓存和加载对值进行sessionStorage存取
 * */
declare function useSessionState<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
declare function useSessionState<S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
declare function useSessionState<S>(key: string, initialState: S | (() => S), option?: UseSessionStateOptions): [S, Dispatch<SetStateAction<S>>];
export { useSessionState, setSessionState, getSessionState, };
