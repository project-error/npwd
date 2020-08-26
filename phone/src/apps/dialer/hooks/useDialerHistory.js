import { useRecoilState, atom } from "recoil";

const dialerHistoryState = atom({
  key: "dialerHistory",
  default: [
    {
      id: 0,
      caller: "Kidz",
      phoneNumber: "000-1111",
      type: "incoming",
    },
    {
      id: 1,
      caller: "ROCKY",
      phoneNumber: "000-1112",
      type: "outgoing",
    },
  ],
});

export const useDialerHistory = () => {
  const [history, setHistory] = useRecoilState(dialerHistoryState);
  return { history, setHistory };
};
