import { useState } from 'react';
import { useFn } from '@lxjx/hooks';
export function useToggle(init) {
    if (init === void 0) { init = false; }
    var _a = useState(init), toggle = _a[0], set = _a[1];
    var s = useFn(function (next) {
        if (next !== undefined) {
            set(next);
            return;
        }
        set(function (prev) { return !prev; });
    });
    return [toggle, s];
}
