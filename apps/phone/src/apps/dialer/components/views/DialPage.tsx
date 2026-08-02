import React, { useState } from 'react';
import DialGrid from '../DialPadGrid';
import { DialerInput } from '../DialerInput';
import { DialInputCtx } from '../../context/InputContext';
import { useQueryParams } from '@common/hooks/useQueryParams';

const DialPage: React.FC = () => {
  const query = useQueryParams();
  const queryNumber = query.number;
  const [inputVal, setInputVal] = useState(queryNumber || '');

  return (
    <div className="flex min-h-full w-full flex-col">
      <DialInputCtx.Provider
        value={{
          inputVal,
          add: (val: string) => setInputVal(inputVal + val),
          removeOne: () => setInputVal(inputVal.slice(0, -1)),
          clear: () => setInputVal(''),
          set: (val: string) => setInputVal(val),
        }}
      >
        <DialerInput />
        <DialGrid />
      </DialInputCtx.Provider>
    </div>
  );
};
export default DialPage;
