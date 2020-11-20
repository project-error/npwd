import { useRecoilState } from 'recoil';
import { MessageGroup } from '../../../common/interfaces/messages';
import { messageState } from './state';

interface IUseModal {
  activeMessageGroup: MessageGroup | null;
  setActiveMessageGroup: (group: MessageGroup | null) => void;
  showNewMessageGroup: boolean;
  setShowNewMessageGroup: (value: boolean) => void;
}

export default (): IUseModal => {
  const [ activeMessageGroup, setActiveMessageGroup ] = useRecoilState<MessageGroup | null>(messageState.activeMessageGroup)
  const [ showNewMessageGroup, setShowNewMessageGroup ] = useRecoilState<boolean>(messageState.showNewMessageGroup)
  return { activeMessageGroup, setActiveMessageGroup, showNewMessageGroup, setShowNewMessageGroup };
}