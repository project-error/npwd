import { useRecoilState, atom } from 'recoil';

const dialerHistoryState = atom({
  key: 'dialerHistory',
  default: [
    {
      id: 1,
      caller: 'ROCKY',
      phoneNumber: '000-1112',
      type: 'outgoing',
    },
  ],
});

export const useDialerHistory = () => {
  const [history, setHistory] = useRecoilState(dialerHistoryState);
  return { history, setHistory };
};
