import React, { useCallback, useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  nextPage: (page: number) => void;
  inverse: boolean;
  dataLength: number;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  nextPage,
  inverse,
  dataLength,
}) => {
  const loader = useRef(null);
  const [page, setPage] = useState(1);

  const handleObserver = useCallback((entities: IntersectionObserverEntry[]) => {
    const target = entities[0];

    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    nextPage(page);
  }, [nextPage, page]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '25px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [handleObserver]);

  return (
    <>
      {inverse && <div ref={loader} />}
      {children}
      {!inverse && <div ref={loader} />}
    </>
  );
};
