import React, { useEffect, useState } from 'react';
import { Bills } from '@typings/debtkollector';
import { fetchBills } from '../hooks/state';
import { Box } from '@mui/material';
import { List } from '@ui/components/List';
import { Bill } from './Bill';
import CircularProgress from '@mui/material/CircularProgress';

// IF player has no bills make sure it renders a nobill page.

export const DebtKollectorApp: React.FC = () => {
  const [billData, setBillData] = useState<Bills[]>(null);
  const [updater, setUpdater] = useState(0);
  useEffect(() => {
    const getBills = async () => {
      const billsList = await fetchBills();
      setBillData(billsList);
    };
    getBills();
  }, [updater]);

  return (
    <Box height="100%" width="100%" p={2}>
      {billData == null ? (
        <CircularProgress />
      ) : (
        <List>
          {billData.length > 0 ? (
            billData.map((bill) => <Bill key={bill.id} {...bill} />)
          ) : (
            <p> No Bills Fam. </p>
          )}
        </List>
      )}
    </Box>
  );
};
