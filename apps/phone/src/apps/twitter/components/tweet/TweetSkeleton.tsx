import React from 'react';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { Box, styled } from '@mui/material';

const SkeletonRoot = styled(Box)({
  width: '100%',
  padding: '15px',
  display: 'flex',
  flexFlow: 'row nowrap',
  marginTop: '3px',
  marginBottom: '3px',
});

export default function TweetSkeleton() {
  return (
    <>
      <SkeletonRoot>
        <Box>
          <Skeleton variant="circular" width={60} height={60} />
        </Box>
        <Box ml={15} mt={-5}>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" width={250} height={118} />
        </Box>
      </SkeletonRoot>

      <Divider />
    </>
  );
}
