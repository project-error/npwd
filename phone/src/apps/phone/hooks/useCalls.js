import { useRecoilState, atom } from 'recoil';

const callListState = atom({
    key: 'callList',
    default: [
        {
            id: 0,
            caller: 'Kidz',
            phoneNumber: "000-1111",
            type: 'incoming'
        },
        {
            id: 1,
            caller: 'ROCKY',
            phoneNumber: '000-1112',
            type: 'outgoing'
        },
    ],
});

export const useCalls = () => {
    const [callList, setCallList] = useRecoilState
    (callListState);
    return { callList, setCallList };
}