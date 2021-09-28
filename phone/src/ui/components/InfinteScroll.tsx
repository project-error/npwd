import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
	nextPage: (page: number) => void;
  nextPageNumber: number;
	inverse: boolean;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = (children, { nextPage, inverse = false, nextPageNumber  }) => {
  const loader = useRef(null);
  const [page, setPage] = useState(0);
  
  const handleObserver = (entites) => {
    const target = entites[0];

    if (target.isIntersecting) {
      // update page
      setPage((prev) => page + nextPageNumber);
    }
  };
  
  useEffect(() => {
    nextPage(page);
  }, [page])

  useEffect(() => {
    const options: any = {
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
      {inverse && <div ref={loader} />}
      {children}
      {!inverse && <div ref={loader} />}
    </div>
  )
};

