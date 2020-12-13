import { useRecoilState } from 'recoil';
import { CreateMessageGroupResult } from '../../../common/typings/messages';

import { messageState } from './state';

interface IUseAlerts {
  createMessageGroupResult: CreateMessageGroupResult | null;
  clearCreateMessageGroupResult: () => void;
}

export default (): IUseAlerts => {
  const [
    createMessageGroupResult,
    setCreateMessageGroupResult,
  ] = useRecoilState<CreateMessageGroupResult | null>(
    messageState.createMessageGroupResult
  );

  const clearCreateMessageGroupResult = () => setCreateMessageGroupResult(null);
  return { createMessageGroupResult, clearCreateMessageGroupResult };
};
