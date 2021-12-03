import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Fab } from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
  },
});

interface ProfileUpdateButtonProps {
  handleClick: () => void;
}

export const ProfileUpdateButton: React.FC<ProfileUpdateButtonProps> = ({ handleClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab color="primary" onClick={handleClick}>
        <PublishIcon />
      </Fab>
    </div>
  );
};

export default ProfileUpdateButton;
