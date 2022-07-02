import React from 'react';
import { Box, Fab, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UpdateButtonRoot = styled(Box)({
  position: 'absolute',
  bottom: '75px',
  right: '10px',
});

export function ProfileUpdateButton({ handleClick }) {
  return (
    <UpdateButtonRoot>
      <Fab color="primary" onClick={handleClick}>
        <SearchIcon />
      </Fab>
    </UpdateButtonRoot>
  );
}

export default ProfileUpdateButton;
