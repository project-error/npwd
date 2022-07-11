import { Bills } from '@typings/debtkollector';
import React from 'react';

export const Bill: React.FC<Bills> = ({ children, ...bill }) => {
  return (
    <div>
      <p> Id: {bill.id} </p>
      <p> Amount: {bill.amount} </p>
      <p> Label: {bill.label} </p>
      <p> Target: {bill.target} </p>
    </div>
  );
};
