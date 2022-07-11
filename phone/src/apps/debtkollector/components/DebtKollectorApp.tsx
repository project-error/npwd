import React, { useEffect, useState } from 'react';
import { Bills } from '@typings/debtkollector';
import { fetchBills } from '../hooks/state';
import { Bill } from './Bill';

// IF player has no bills make sure it renders a nobill page.

export const DebtKollectorApp: React.FC = () => {
  const [billData, setBillData] = useState<Bills[]>(null);
  useEffect(() => {
    const getBills = async () => {
      const billsList = await fetchBills();
      setBillData(billsList);
    };
    getBills();
  }, []);
  return (
    <>
      {billData != null ? (
        billData.map((bill) => <Bill key={bill.id} {...bill} />)
      ) : (
        <p> Sorry Fam</p>
      )}
    </>
  );
};
