import qs, { ParsedQs } from 'qs';
import { useLocation } from 'react-router-dom';

export const useQueryParams = (): ParsedQs => {
  return qs.parse(useLocation().search);
};
