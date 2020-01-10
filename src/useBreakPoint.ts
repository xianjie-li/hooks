import { createBreakpoint } from 'react-use';

const useBreakPointBase = createBreakpoint({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
});

const useBreakPoint = () => {
  const bp = useBreakPointBase();
  return {
    xs: bp === 'xs',
    sm: bp === 'sm',
    md: bp === 'md',
    lg: bp === 'lg',
    xl: bp === 'xl',
    xxl: bp === 'xxl',
  };
};

export {
  useBreakPoint,
};
