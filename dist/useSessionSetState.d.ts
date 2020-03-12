import { UseSessionStateOptions } from './useSessionState';
import { SetState } from './useSetState';
export declare const useSessionSetState: <T extends object = any>(key: string, initialState?: T | (() => T), options?: UseSessionStateOptions | undefined) => [T, SetState<T>, SetState<T>];
