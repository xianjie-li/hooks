import { useState } from 'react';
import { useFn } from '@lxjx/hooks';
export var useUpdate = function () {
    var _a = useState(0), setCount = _a[1];
    return useFn(function () { return setCount(function (prev) { return prev + 1; }); });
};
