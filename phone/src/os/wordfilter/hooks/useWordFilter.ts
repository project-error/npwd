import { useContext } from 'react';
import { FilterCtx } from '../providers/WordFilterProvider';

export const useWordFilter = () => {
  const context = useContext(FilterCtx);
  if (!context) {
    throw new Error('useWordFilter must be wrapped by WordFilterProvider');
  }
  return context;
};
