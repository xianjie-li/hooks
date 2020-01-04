import React, { useState } from 'react';

import { useFormState, FormLike } from '../useFormState';

const Inp: React.FC<FormLike<string>> = (props) => {
  const [state, setState] = useFormState(props, '');

  return (
    <input type="text" value={state} onChange={({ target }) => {
      // setState(target.value, 123);
      setState(prev => {
        console.log(prev, target.value);
        return target.value;
      }, 123);
    }} />
  )
};

const UseFormState = () => {
  const [value, setValue] = useState("10086");
  return (
    <div>
      <div>UseFormState {value}</div>
      <Inp value={value} onChange={(value, extra) => {
        // console.log(value, extra);
        setValue(value);
      }} />
      <button onClick={() => setValue(String(Math.random()))}>change</button>
      <button onClick={() => setValue('10086')}>10086</button>
    </div>
  );
};

export default UseFormState;
