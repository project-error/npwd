import { useRecoilState } from 'recoil';
import { messageState } from './state';

export const useFilter = () => {
  const [ messageFilter, setMessageFilter ] = useRecoilState(messageState.filter)
  return { messageFilter, setMessageFilter}
}