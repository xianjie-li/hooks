interface SetState<T> {
    (patch: Partial<T> | ((prevState: T) => Partial<T>)): void;
}
export declare const useSetState: <T>(initialState?: T) => [T, SetState<T>, SetState<T>];
export {};
