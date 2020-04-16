import React from 'react';
import { useToggle } from 'react-use';
import { useLockBodyScroll } from './useLockBodyScroll';

const UseLockBodyScrollDemo = () => {
  const [bool, set] = useToggle(false);
  const [bool2, set2] = useToggle(false);
  const [bool3, set3] = useToggle(false);

  useLockBodyScroll(bool);
  useLockBodyScroll(bool2);
  useLockBodyScroll(bool3);

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
