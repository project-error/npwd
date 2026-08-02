import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';

interface MatchPaginationProps {
  totalCount: number;
  onChange: (e: React.ChangeEvent<unknown>, page: number) => void;
}

const MatchPagination: React.FC<MatchPaginationProps> = ({ totalCount, onChange }) => {
  const [page, setPage] = React.useState(1);

  const handleChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalCount) return;
    setPage(nextPage);
    onChange({} as React.ChangeEvent<unknown>, nextPage);
  };

  return (
    <div className="flex items-center gap-3">
      <NPWDButton size="icon" variant="ghost" onClick={() => handleChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft size={20} />
      </NPWDButton>
      <span className="text-sm text-keyos-cream">
        {page} / {totalCount}
      </span>
      <NPWDButton
        size="icon"
        variant="ghost"
        onClick={() => handleChange(page + 1)}
        disabled={page >= totalCount}
      >
        <ChevronRight size={20} />
      </NPWDButton>
    </div>
  );
};

export default React.memo(MatchPagination);
