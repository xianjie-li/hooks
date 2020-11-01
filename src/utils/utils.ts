import { isDom } from '@lxjx/utils';
import { RefObject } from 'react';

/**
 * 依次从target、target.current、ref.current取值，只要有任意一个为dom元素则返回
 * 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined
 * */
export function getRefDomOrDom<H = HTMLElement>(
  target?: any,
  ref?: RefObject<any>
): H | undefined {
  if (!target) return undefined;
  if (isDom(target)) return (target as unknown) as H;
  if (isDom(target.current)) return target.current as H;
  if (ref && isDom(ref.current)) return (ref.current as unknown) as H;
  return undefined;
}
