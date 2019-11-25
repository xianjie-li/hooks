import { createBreakpoint } from 'react-use';

const useBreakPoint = createBreakpoint({
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200,
});

export {
  useBreakPoint,
};

