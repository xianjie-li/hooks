/// <reference types="node" />
export declare type AnyObject = {
    [key: string]: any;
};
export declare type AnyFn = (...arg: any[]) => any;
export declare const placeHolderFn: () => undefined;
export declare function getGlobal(): (Window & typeof globalThis) | NodeJS.Global;
