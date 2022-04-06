import React from 'react';
import { Pagination } from '@mui/material';

interface MatchPaginationProps {
  totalCount: number;
  onChange: (e: React.ChangeEvent<unknown>, page: number) => void;
}

const MatchPagination: React.FC<MatchPaginationProps> = ({ totalCount, onChange }) => {
  return <Pagination defaultPage={1} count={totalCount} onChange={onChange} color="primary" />;
};

export default React.memo(MatchPagination);
