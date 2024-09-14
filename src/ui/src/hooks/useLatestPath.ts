import { useEffect } from 'react';
import { useLocation, useNavigate, useResolvedPath } from 'react-router';

export const useLatestPath = (rootPath: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(location.pathname);
  const lsKey = `lastVisited${rootPath}Path`;

  useEffect(() => {
    if (!resolvedPath.pathname.startsWith(rootPath)) {
      return;
    }

    if (resolvedPath.pathname !== rootPath) {
      localStorage.setItem(lsKey, resolvedPath.pathname);
    }
  }, [resolvedPath]);

  useEffect(() => {
    const lastVisitedPath = localStorage.getItem(lsKey);
    if (lastVisitedPath && lastVisitedPath !== location.pathname) {
      navigate(lastVisitedPath, {
        replace: true,
      });
    }
  }, []);
};
