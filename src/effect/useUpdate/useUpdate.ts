import { useState } from 'react';
import { useFn } from '@lxjx/hooks';

export const useUpdate = () => {
  const [, setCount] = useState(0);

  return useFn(() => setCount(prev => prev + 1));
};
