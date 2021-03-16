import { Box, Tooltip, Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { MarketplaceEvents, MarketplaceListing } from '../../../../../../typings/marketplace';
import { useSimcard } from '../../../../os/simcard/hooks/useSimcard';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import ChatIcon from '@material-ui/icons/Chat';
import PhoneIcon from '@material-ui/icons/Phone';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { CallEvents } from '../../../../../../typings/call';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    color: theme.palette.primary.main,
  },
}));

export const ListingActions = ({ listing }: { listing: MarketplaceListing }) => {
  const classes = useStyles();
  const { number: myNumber } = useSimcard();
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeleteListing = () => {
    Nui.send(MarketplaceEvents.DELETE_LISTING, {
      id: listing.id,
    });
  };

  const handleReportListing = () => {
    Nui.send(MarketplaceEvents.REPORT_LISTING, listing);
  };

  const handleCall = () => {
    Nui.send(CallEvents.INITIALIZE_CALL, {
      number: listing.number,
    });
  };

  const handleMessage = () => {
    history.push(`/messages/new/${listing.number}`);
  };

  return (
    <Box flex justifyContent="space-between" alignItems="center">
      <div style={{ float: 'left' }}>
        {listing.number !== myNumber ? (
          <>
            <Tooltip title={t('GENERIC_MESSAGE')}>
              <Button onClick={handleMessage}>
                <ChatIcon className={classes.icon} />
              </Button>
            </Tooltip>
            <Tooltip title={`${t('GENERIC_CALL')}: ${listing.number}`}>
              <Button onClick={handleCall}>
                <PhoneIcon className={classes.icon} />
              </Button>
            </Tooltip>
          </>
        ) : null}
      </div>

      <div style={{ float: 'right' }}>
        {listing.number === myNumber ? (
          <Tooltip title={t('GENERIC_DELETE')}>
            <Button onClick={handleDeleteListing}>
              <DeleteIcon />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title={t('GENERIC_REPORT')}>
            <Button onClick={handleReportListing}>
              <ReportIcon />
            </Button>
          </Tooltip>
        )}
      </div>
    </Box>
  );
};
