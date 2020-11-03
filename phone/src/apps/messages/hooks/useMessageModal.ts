import { useRecoilState } from 'recoil';
import { messageState } from './state';

export const useMessageModal = () => {
  const [ messageModal, setMessageModal ] = useRecoilState(messageState.modal)
  return { messageModal,  setMessageModal }
}