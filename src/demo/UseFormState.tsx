import React, { useState } from 'react';

import { useFormState, FormLike } from '../useFormState';

const Inp: React.FC<FormLike<string>> = (props) => {
  const [state, setState] = useFormState(props);

  return (
    <input type="text" value={state} onChange={({ target }) => {
      setState(target.value, 123);
    }} />
  )
};

const UseFormState = () => {
  const [value, setValue] = useState("10086");

  return (
    <div>
      <div>UseFormState {value}</div>
      <Inp value={value} onChange={(value, extra) => {
        console.log(value, extra);
        setValue(value);
      }} />
    </div>
  );
};

export default UseFormState;
