import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Paper } from '@material-ui/core';
import { ListItem } from '../../../../ui/components/ListItem';
import ChatIcon from '@material-ui/icons/Chat';
import PhoneIcon from '@material-ui/icons/Phone';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';

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
  header: {
    margin: 10,
  },
  headerTypo: {
    margin: 5,
  },
  desc: {
    padding: 10,
  },
}));

export const SelloutItem = (listing) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.root}>
      <div className={classes.content}>
        <Paper elevation={2} className={classes.paper}>
          <div className={classes.header}>
            <Typography className={classes.headerTypo} variant="h5">
              {listing.name}
            </Typography>
            <Typography
              className={classes.headerTypo}
              style={{ borderBottom: '1px solid #f44336' }}
            >
              {listing.number}
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
          <Typography variant="h6" className={classes.desc}>
            {listing.description}
          </Typography>
          <div>
            <Button>
              <ChatIcon className={classes.icon} />
            </Button>
            <Button>
              <PhoneIcon className={classes.icon} />
            </Button>
          </div>
        </Paper>
      </div>
    </ListItem>
  );
};
