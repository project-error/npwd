import { useRecoilState, atom } from 'recoil';

const transactionListState = atom({
    key: 'transactionList',
    default: [
        {
            id: 0,
            amount: 300,
            type: 'withdraw',
            date: '3'
        },
        {
            id: 1,
            amount: 1000,
            type: 'withdraw',
            date: '3'
        },
        {
            id: 2,
            amount: 50,
            type: 'transfer',
            date: '2'
        },
    ],
});

export const useBank = () => {
    const [transactionList, setTransactionList] = useRecoilState
    (transactionListState);
    return { transactionList, setTransactionList };
}