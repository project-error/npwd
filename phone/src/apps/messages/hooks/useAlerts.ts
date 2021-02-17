import { useRecoilValue } from 'recoil';
import { CreateMessageGroupResult } from '../../../common/typings/messages';

import { messageState } from './state';

interface IUseAlerts {
  createMessageGroupResult: CreateMessageGroupResult | null;
}

export default (): IUseAlerts => {
  const createMessageGroupResult = useRecoilValue<CreateMessageGroupResult | null>(
    messageState.createMessageGroupResult
  );

  return { createMessageGroupResult };
};
