import { RefObject } from 'react';
/**
 * 依次从target、target.current、ref.current取值，只要有任意一个为dom元素则返回
 * 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined
 * */
export declare function getRefDomOrDom<H = HTMLElement>(target?: any, ref?: RefObject<any>): H | undefined;
//# sourceMappingURL=utils.d.ts.map