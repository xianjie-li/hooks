import { useRef } from 'react';
/**
 * 返回一个实例对象
 * @param init - 初始值
 * @return self - 实例对象
 * */
export function useSelf(init) {
    if (init === void 0) { init = {}; }
    var self = useRef(init);
    return self.current;
}
//# sourceMappingURL=useSelf.js.map