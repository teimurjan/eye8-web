import React from 'react';

import { safeWindow, safeWindowOperation } from '@eye8/shared/utils';

export interface State {
  x: number;
  y: number;
}

const useWindowScroll = (): State => {
  const [state, setState] = React.useState<State>({
    x: safeWindow((w) => w.pageXOffset, 0),
    y: safeWindow((w) => w.pageYOffset, 0),
  });

  React.useEffect(() => {
    const handler = () => {
      setState({
        x: safeWindow((w) => w.pageXOffset, 0),
        y: safeWindow((w) => w.pageYOffset, 0),
      });
    };

    safeWindowOperation((w) =>
      w.addEventListener('scroll', handler, {
        capture: false,
        passive: true,
      }),
    );

    return () => safeWindow((w) => w.removeEventListener('scroll', handler), undefined);
  }, []);

  return state;
};

export default useWindowScroll;
