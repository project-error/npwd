import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Paper } from '@mui/material';
import { ListItem } from '@ui/components/ListItem';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { MarketplaceListing } from '@typings/marketplace';
import { ListingActions } from './ListingActions';
import { PictureReveal } from '@ui/components/PictureReveal';

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
    flexFlow: 'column nowrap',
    width: '100%',
  },
  paper: {
    overflow: 'auto',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex',
    borderWidth: 2,
    height: 'auto',
    background: theme.palette.background.paper,
    marginBottom: 20,
  },
  listingContent: {
    padding: 10,
    minWidth: 100,
    maxWidth: '100%',
    width: '100%',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
  },
}));

export const MarketplaceItem: React.FC<MarketplaceListing> = ({ children, ...listing }) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.root}>
      <div className={classes.content}>
        <Paper elevation={2} variant="outlined" className={classes.paper}>
          <div style={{ margin: 10 }}>
            <Typography style={{ margin: 5 }} variant="h5">
              {listing.name}
            </Typography>
            <Typography variant="h5" style={{ padding: 5 }}>
              {listing.title}
            </Typography>
          </div>

          {listing.url ? (
            <PictureReveal>
              <PictureResponsive src={listing.url} alt={`${listing.name}`} />
            </PictureReveal>
          ) : (
            <Typography style={{ margin: 10 }}>
              No image provided{' '}
              <span role="img" aria-label="emoji">
                🙁
              </span>
            </Typography>
          )}

          <Typography variant="body1" className={classes.listingContent}>
            {listing.description}
          </Typography>
          <ListingActions {...listing} />
        </Paper>
      </div>
    </ListItem>
  );
};
