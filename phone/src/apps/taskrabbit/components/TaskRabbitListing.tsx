import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Paper } from '@mui/material';
import { ListItem } from '@ui/components/ListItem';
import { TaskRabbitJobs } from '@typings/taskrabbit';
import { Link } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#03bb85',
  },
  '& .MuiRating-iconHover': {
    color: '#03bb93',
  },
});

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
      cursor: "pointer",
      textAlign: 'center',
      "&:hover": {
        background: '#03bb85',
      },
      transition: theme.transitions.create(["background", "background-color"], {
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

export const TaskRabbitListing: React.FC<TaskRabbitJobs> = ({ children, ...job }) => {
    const classes = useStyles();
    return (
        <Link to={'taskrabbit/job?id='+ job.id}>
            <ListItem className={classes.root}>
                <div className={classes.content}>
                <Paper variant="outlined" className={classes.paper}>
                    <div style={{ margin: 10 }}>
                    <Typography style={{ margin: 5 }} variant="h5">
                        {job.title}
                    </Typography>
                    <StyledRating
                      name="customized-color"
                      defaultValue={job.stars}
                      precision={0.5}
                      readOnly
                      icon={<AttachMoneyIcon fontSize="inherit" />}
                      emptyIcon={<AttachMoneyOutlinedIcon fontSize="inherit" />
                    }/>
                    </div>
                </Paper>
                </div>
            </ListItem>
      </Link>
    );
  };
  