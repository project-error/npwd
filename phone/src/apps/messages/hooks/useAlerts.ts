import { useRecoilState } from 'recoil';

import { messageState } from './state';

interface IUseAlerts {
  createMessageGroupResult: any;
  setCreateMessageGroupResult: any;
}

export default (): IUseAlerts => {
  const [createMessageGroupResult, setCreateMessageGroupResult] = useRecoilState<any>(messageState.createMessageGroupResult)
  return { createMessageGroupResult, setCreateMessageGroupResult };
}