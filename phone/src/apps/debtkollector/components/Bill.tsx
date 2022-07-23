import { Bills } from '@typings/debtkollector';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ListItem } from '@ui/components/ListItem';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { AttachMoney } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '3px',
    transition: 'opacity 0.5s ease',
  },
  content: {
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'center',
    transition: theme.transitions.create(['background', 'background-color'], {
      duration: theme.transitions.duration.complex,
    }),
  },
  paper: {
    overflow: 'auto',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex',
    borderWidth: 2,
    height: 'auto',
    background: theme.palette.background.paper,
    marginBottom: 10,
    padding: 5,
  },
  '@keyframes rotate': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
  rotate: {
    transform: 'rotate(90deg)',
    color: 'rgb(33, 150, 243)',
    transition: 'transform 150ms ease', // smooth transition
  },
  row: {
    height: '100%',
  },
  garageLocationShow: {
    animation: 'fadeIn 5s',
    opacity: 1,
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  garageLocationHidden: {
    opacity: 0,
    display: 'none',
  },
  garageLocationStored: {
    color: 'white',
    '&:hover': {
      boxShadow: '0px 8px 8px 0px rgb(33, 150, 243)',
    },
  },
  garageLocationImpound: {
    color: 'white',
    cursor: 'default',
    '&:hover': {
      boxShadow: '0px 8px 8px 0px yellow',
    },
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  height: '100%',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Bill: React.FC<Bills> = ({ children, ...bill }) => {
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState<boolean>(false); // Click Effect
  const [isHover, setIsHover] = useState<boolean>(false); // Hover Effect

  const handlePayBill = () => {
    // fetch bill by { bill.id }
    // pay the bill
  };

  return (
    <Box height="100%" width="100%">
      <ListItem
        className={classes.root}
        onClick={() => setIsClicked(!isClicked)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => {
          setIsHover(false);
          setIsClicked(false);
        }}
      >
        <div className={classes.content}>
          <Paper variant="outlined" className={classes.paper}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid className={classes.row} container item spacing={3}>
                  <Grid item xs={2}>
                    <Item elevation={0}>
                      <AttachMoney className={`${isHover && classes.rotate}`} fontSize="small" />
                    </Item>
                  </Grid>
                  <Grid item xs={7}>
                    <Item elevation={0}>{bill.label}</Item>
                  </Grid>
                  <Grid item xs={3}>
                    <Item elevation={0}>${bill.amount}</Item>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                className={isClicked ? classes.garageLocationShow : classes.garageLocationHidden}
              >
                <Item className={classes.garageLocationStored} onClick={handlePayBill}>
                  Pay Bill
                </Item>
              </Grid>
            </Box>
          </Paper>
        </div>
      </ListItem>
    </Box>
  );
};
