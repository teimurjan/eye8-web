import { useRouter } from 'next/router';
import * as React from 'react';

export enum Status {
  Loading,
  Loaded,
  Failed,
}

export const useRouteChangeStatus = () => {
  const router = useRouter();

  const [status, setStatus] = React.useState<Status>(Status.Loaded);

  const onRouteChangeStart = React.useCallback(() => {
    setStatus(Status.Loading);
  }, []);
  const onRouteChangeComplete = React.useCallback(() => {
    setStatus(Status.Loaded);
  }, []);
  const onRouteChangeError = React.useCallback(() => {
    setStatus(Status.Loaded);
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
