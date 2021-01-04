import { useRouter } from 'next/router';
import React from 'react';

export enum RouteChangeStatus {
  Loading,
  Loaded,
  Failed,
}

const useRouteChangeStatus = () => {
  const router = useRouter();

  const [status, setStatus] = React.useState<RouteChangeStatus>(RouteChangeStatus.Loaded);

  const onRouteChangeStart = React.useCallback(() => {
    setStatus(RouteChangeStatus.Loading);
  }, []);
  const onRouteChangeComplete = React.useCallback(() => {
    setStatus(RouteChangeStatus.Loaded);
  }, []);
  const onRouteChangeError = React.useCallback(() => {
    setStatus(RouteChangeStatus.Loaded);
  }, []);

  React.useEffect(() => {
    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    router.events.on('routeChangeError', onRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.events.off('routeChangeError', onRouteChangeError);
    };
  }, [router, onRouteChangeStart, onRouteChangeComplete, onRouteChangeError]);

  return status;
};

export default useRouteChangeStatus;
