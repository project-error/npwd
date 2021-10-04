import React, { useCallback, useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  nextPage: (page: number) => void;
  inverse: boolean;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  nextPage,
  inverse = false,
}) => {
  const loader = useRef(null);
  const [page, setPage] = useState(1);

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];

    if (target.isIntersecting) {
      // update page
      console.log('hit target');
      setPage((prev) => page + 1);
    }
  };

  useEffect(() => {
    nextPage(page);
  }, [page]);

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
  }, []);

  return (
    <div>
      <div ref={loader} />
      {children}
    </div>
  );
};
