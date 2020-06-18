import * as React from 'react';

import { safeWindow } from 'src/utils/dom';

export interface State {
  x: number;
  y: number;
}

export const useWindowScroll = (): State => {
  const [state, setState] = React.useState<State>({
    x: safeWindow(w => w.pageXOffset, 0),
    y: safeWindow(w => w.pageYOffset, 0),
  });

  React.useEffect(() => {
    const handler = () => {
      setState({
        x: safeWindow(w => w.pageXOffset, 0),
        y: safeWindow(w => w.pageYOffset, 0),
      });
    };

    safeWindow(
      w =>
        w.addEventListener('scroll', handler, {
          capture: false,
          passive: true,
        }),
      undefined,
    );

    return () => {
      safeWindow(w => w.removeEventListener('scroll', handler), undefined);
    };
  }, []);

  return state;
};
