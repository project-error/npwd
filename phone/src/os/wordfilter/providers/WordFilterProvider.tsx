import React, { createContext, useMemo } from 'react';
import { usePhone } from '@os/phone/hooks/usePhone';

type FilterContext = {
  filter: RegExp | null;
  clean: (message: string) => string;
};
export const FilterCtx = createContext<FilterContext>({} as FilterContext);

export function WordFilterProvider({ children }) {
  const { ResourceConfig } = usePhone();
  const { enabled, badWords = [] } = ResourceConfig?.profanityFilter ?? {};

  const filter = useMemo(() => {
    return new RegExp(badWords.join('|'), 'ig');
  }, [badWords]);

  const clean = (message: string) => {
    if (!enabled || !filter) return message;
    return message.replace(filter, (word) => '*'.repeat(word.length));
  };

  return (
    <FilterCtx.Provider
      value={{
        filter,
        clean,
      }}
    >
      {children}
    </FilterCtx.Provider>
  );
}
