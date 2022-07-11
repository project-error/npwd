import { Bills } from '@typings/debtkollector';

export const MockBillingData: Bills[] = [
  {
    id: 1,
    target: 'char1:db663f1fb54c01ea3a83b9417e41f1ac6e93a3b2',
    label: 'Mechanic Service Bill',
    amount: 1000,
  },
  {
    id: 2,
    target: 'society_burgershot',
    label: 'Restaurant Bill',
    amount: 1000,
  },
];
