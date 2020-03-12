import { AnyFn } from './util';
export interface UseThrottleOption {
    /** true | 指定调用在节流开始前 */
    leading?: boolean;
    /** true | 指定调用在节流结束后 */
    trailing?: boolean;
}
export declare function useThrottle<T extends AnyFn>(wait?: number, { leading, trailing, }?: UseThrottleOption): (method: T, ...args: Parameters<T>) => void;
