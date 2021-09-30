import { Box, Tooltip, Button } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { MarketplaceEvents, MarketplaceListing } from '../../../../../../typings/marketplace';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { fetchNui } from '../../../../utils/fetchNui';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useMyPhoneNumber } from '../../../../os/simcard/hooks/useMyPhoneNumber';
import { useCall } from '../../../../os/call/hooks/useCall';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    color: theme.palette.primary.main,
  },
}));

export const ListingActions: React.FC<MarketplaceListing> = ({ children, ...listing }) => {
  const classes = useStyles();
  const myNumber = useMyPhoneNumber();
  const { t } = useTranslation();
  const history = useHistory();
  const { initializeCall } = useCall();
  const { addAlert } = useSnackbar();

  const handleDeleteListing = () => {
    fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
      id: listing.id,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_MARKETPLACE_DELETE_LISTING_FAILED'),
          type: 'error',
        });
      }

      addAlert({
        message: t('APPS_MARKETPLACE_DELETE_LISTING_SUCCESS'),
        type: 'success',
      });
    });
  };

  const handleReportListing = () => {
    fetchNui<ServerPromiseResp>(MarketplaceEvents.REPORT_LISTING, {
      listingId: listing.id,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_MARKETPLACE_REPORT_LISTING_FAILED'),
          type: 'error',
        });
      }

      addAlert({
        message: t('APPS_MARKETPLACE_REPORT_LISTING_SUCCESS'),
        type: 'success',
      });
    });
  };

  const handleCall = () => {
    initializeCall(listing.number);
  };

  const handleMessage = () => {
    history.push(`/messages/new/${listing.number}`);
  };

  return (
    <Box justifyContent="space-between" alignItems="center">
      <div style={{ float: 'left' }}>
        {listing.number !== myNumber && (
          <>
            <Tooltip title={t('GENERIC.MESSAGE')}>
              <Button onClick={handleMessage}>
                <ChatIcon className={classes.icon} />
              </Button>
            </Tooltip>
            <Tooltip title={`${t('GENERIC.CALL')}: ${listing.number}`}>
              <Button onClick={handleCall}>
                <PhoneIcon className={classes.icon} />
              </Button>
            </Tooltip>
          </>
        )}
      </div>

      <div style={{ float: 'right' }}>
        {listing.number === myNumber ? (
          <Tooltip title={t('GENERIC.DELETE')}>
            <Button onClick={handleDeleteListing}>
              <DeleteIcon />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title={t('GENERIC.REPORT')}>
            <Button onClick={handleReportListing}>
              <ReportIcon />
            </Button>
          </Tooltip>
        )}
      </div>
    </Box>
  );
};
