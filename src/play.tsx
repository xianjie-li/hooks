import React from 'react';
import { useCheck } from './ui/useCheck';

const Play = () => {
  const check = useCheck({
    options: [1, 2],
    // collector: item => item,
  });

  console.log(check);

  return (
    <div>
      <div>{check.checked}</div>
      <div>allChecked: {check.allChecked.toString()}</div>
      <div>partialChecked: {check.partialChecked.toString()}</div>
      <div>noneChecked: {check.noneChecked.toString()}</div>
      <div>
        <button onClick={() => check.check(1)}>add1</button>
        <button onClick={() => check.check(2)}>add2</button>
        <button onClick={() => check.check(3)}>add3</button>
        <button onClick={() => check.unCheck(1)}>rm1</button>
        <button onClick={() => check.unCheck(2)}>rm2</button>
        <button onClick={() => check.unCheck(3)}>rm3</button>
        <button onClick={() => check.toggleAll()}>toggleAll</button>
      </div>
    </div>
  );
};

export default Play;
