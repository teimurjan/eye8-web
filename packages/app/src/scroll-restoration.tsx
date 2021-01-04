import { useRouter } from 'next/router';
import React from 'react';

const Context = React.createContext<null>(null);

interface IProps {
  children: React.ReactNode;
}

export const ScrollRestorationWrapper: React.FC<IProps> = ({ children }) => {
  const router = useRouter();

  const cachedScrollPositions = React.useRef<Array<number[]>>([]);
  const nextScrollPosition = React.useRef<number[] | undefined>();

  React.useEffect(() => {
    const onRouteChangeStart = () => {
      cachedScrollPositions.current.push([window.scrollX, window.scrollY]);
    };

    const onRouteChangeComplete = () => {
      if (nextScrollPosition.current) {
        const [x, y] = nextScrollPosition.current;
        window.scrollTo(x, y);
        nextScrollPosition.current = undefined;
      }
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    router.beforePopState(() => {
      nextScrollPosition.current = cachedScrollPositions.current.pop() ?? [];

      return true;
    });

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.beforePopState(() => false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Context.Provider value={null}>{children}</Context.Provider>;
};
