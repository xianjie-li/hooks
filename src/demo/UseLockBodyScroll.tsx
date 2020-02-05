import React from 'react';
import { useToggle } from 'react-use';
import { useLockBodyScroll } from '../index';

const UseSelfDemo = () => {
  const [bool, set] = useToggle(false);
  const [bool2, set2] = useToggle(false);

  useLockBodyScroll(bool);
  useLockBodyScroll(bool2);

  return (
    <div>
      <div>UseSelfDemo</div>
      <button type="button" onClick={() => set(!bool)}>toggle | {bool.toString()}</button>
      <button type="button" onClick={() => set2(!bool2)}>toggle2 | {bool2.toString()}</button>
    </div>
  );
};

export default UseSelfDemo;
