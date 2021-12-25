import { useEffect } from 'react';
import { useFirstMountState } from '@lxjx/hooks';
export var useUpdateEffect = function (effect, deps) {
    var isFirstMount = useFirstMountState();
    useEffect(function () {
        if (!isFirstMount)
            return effect();
    }, deps);
};
