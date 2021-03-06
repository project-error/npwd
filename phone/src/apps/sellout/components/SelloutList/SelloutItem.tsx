import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';
import { ListItem } from '../../../../ui/components/ListItem';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';
import { MarketplaceListing } from '../../../../common/typings/marketplace';
import { ListingActions } from './ListingActions';

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
}));

export const SelloutItem = (listing: MarketplaceListing) => {
  const classes = useStyles();

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
            <PictureResponsive src={listing.url} alt={`${listing.name}`} />
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
          <ListingActions {...listing} />
        </Paper>
      </div>
    </ListItem>
  );
};
