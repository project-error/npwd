import { useEffect } from 'react';
import { useLocation, useNavigate, useResolvedPath } from 'react-router';

export const useLatestPath = (rootPath: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(location.pathname);
  const lsKey = `lastVisited${rootPath}Path`;

  console.log('resolvedPath', resolvedPath);
  console.log('rootPath', rootPath);

  useEffect(() => {
    if (resolvedPath.pathname.startsWith(rootPath) && resolvedPath.pathname !== rootPath) {
      console.log('saving last visited path', resolvedPath.pathname);
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
