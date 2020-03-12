export interface SetState<T> {
    (patch: Partial<T> | ((prevState: T) => Partial<T>)): void;
}
export declare const useSetState: <T extends object>(initialState?: T | (() => T)) => [T, SetState<T>, SetState<T>];
