import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Paper, Tooltip } from '@material-ui/core';
import { ListItem } from '../../../../ui/components/ListItem';
import ChatIcon from '@material-ui/icons/Chat';
import PhoneIcon from '@material-ui/icons/Phone';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';
import { MarketplaceListing } from '../../../../common/typings/marketplace';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import { useSimcard } from '../../../../os/simcard/hooks/useSimcard';
import Nui from '../../../../os/nui-events/utils/Nui';

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '3px',
  },
  content: {
    display: 'flex',
    marginTop: '-10px',
    flexFlow: 'column nowrap',
    width: '100%',
  },
  paper: {
    overflow: 'auto',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex',
    height: 'auto',
    background: theme.palette.background.default,
    marginBottom: 20,
  },
  icon: {
    color: theme.palette.primary.main,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export const SelloutItem = (listing: MarketplaceListing) => {
  const classes = useStyles();

  const { number: myNumber } = useSimcard();

  const handleDeleteListing = (listingId: number) => {
    Nui.send('phone:marketplaceDeleteListing', {
      id: listingId,
    });
  };

  return (
    <ListItem className={classes.root}>
      <div className={classes.content}>
        <Paper elevation={2} className={classes.paper}>
          <div style={{ margin: 10 }}>
            <Typography style={{ margin: 5 }} variant="h5">
              {listing.name}
            </Typography>
            <Typography variant="h5" style={{ padding: 5 }}>
              {listing.title}
            </Typography>
          </div>
          {listing.url ? (
            <PictureResponsive src={listing.url} alt={`${listing.name} image`} />
          ) : (
            <Typography style={{ margin: 10 }}>
              No image provided{' '}
              <span role="img" aria-label="emoji">
                🙁
              </span>
            </Typography>
          )}
          <Typography variant="h6" style={{ padding: 10 }}>
            {listing.description}
          </Typography>
          <div className={classes.actionRow}>
            <div>
              <Tooltip title="Send a message">
                <Button>
                  <ChatIcon className={classes.icon} />
                </Button>
              </Tooltip>
              <Tooltip title={listing.number}>
                <Button>
                  <PhoneIcon className={classes.icon} />
                </Button>
              </Tooltip>
            </div>
            <div>
              {listing.number === myNumber ? (
                <Tooltip title="Delete listing">
                  <Button onClick={() => handleDeleteListing(listing.id)}>
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Report listing">
                  <Button>
                    <ReportIcon />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </ListItem>
  );
};
