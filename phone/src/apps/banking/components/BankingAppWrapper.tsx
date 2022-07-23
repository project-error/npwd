import React, { useState } from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { BankingThemeProvider } from '../providers/BankingThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';

import { BankingDashboardPage } from './pages/BankingDashboardPage';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import ListIcon from '@mui/icons-material/List';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { styled } from '@mui/material/styles';
import { Fab } from '@mui/material';
import { BankingTransactionsPage } from './pages/BankingTransactions';
import { BankingBillsPage } from './pages/BankingBillsPage';
import { DebtKollectorApp } from '../../debtkollector/components/DebtKollectorApp';
// AppContent by default has a React.Suspense which can be used to handle the app as a whole, for
// when it must resolve the render promise. But, we must make sure that this is is mounted in a component
// higher in the tree than the Recoil state caller.
const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

// This is why this wrapper component is needed.
export const BankingAppWrapper: React.FC = () => {
  const example = useApp('BANKING');
  const [page, setPage] = useState(<BankingDashboardPage />);
  return (
    <BankingThemeProvider>
      <AppWrapper>
        <AppTitle app={example} />
        <AppContent>
          {page}
          <AppBar
            position="absolute"
            style={{
              borderTop: '0.2em solid rgb(33, 150, 243)',
              borderBottom: '1px solid rgb(33, 150, 243)',
            }}
            color={'secondary'}
            sx={{ top: 'auto', bottom: 0 }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  setPage(<BankingTransactionsPage />);
                }}
              >
                <ListIcon />
              </IconButton>
              <StyledFab
                aria-label="add"
                color="secondary"
                onClick={() => {
                  setPage(<BankingDashboardPage />);
                }}
              >
                <DashboardIcon />
              </StyledFab>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                onClick={() => {
                  setPage(<DebtKollectorApp />);
                }}
              >
                <ReceiptLongIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </AppContent>
      </AppWrapper>
    </BankingThemeProvider>
  );
};
