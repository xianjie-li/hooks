import React from 'react';
import { useToggle } from 'react-use';
import { useLockBodyScroll } from '@lxjx/hooks';

const UseLockBodyScrollDemo = () => {
  const [bool, set] = useToggle(false);
  const [bool2, set2] = useToggle(true);
  const [bool3, set3] = useToggle(false);

  const lock1 = useLockBodyScroll(bool);
  const lock2 = useLockBodyScroll(bool2);
  const lock3 = useLockBodyScroll(bool3);

  console.log(lock1, lock2, lock3);

  return (
    <div>
      <h3>UseLockBodyScrollDemo</h3>
      <button type="button" onClick={() => set(!bool)}>
        toggle | {bool.toString()}
      </button>
      <button type="button" onClick={() => set2(!bool2)}>
        toggle2 | {bool2.toString()}
      </button>
      <button type="button" onClick={() => set3(!bool3)}>
        toggle3 | {bool3.toString()}
      </button>
    </div>
  );
};

export default UseLockBodyScrollDemo;
