import React, { createContext, useMemo } from 'react';
import { usePhone } from '@os/phone/hooks/usePhone';

export const FilterCtx = createContext<{
  filter: RegExp | null;
  clean: (message: string) => string;
}>(null);

export function WordFilterProvider({ children }) {
  const { ResourceConfig } = usePhone();
  const { enabled, badWords } = ResourceConfig.profanityFilter;

  const filter = useMemo(() => {
    return badWords.length > 1 ? new RegExp(badWords.join('|'), 'ig') : null;
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
