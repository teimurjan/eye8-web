import Mousetrap from 'mousetrap';
import React from 'react';

export const useMousetrap = (keys: string | string[], callback: (e: Event) => void) => {
  React.useEffect(() => {
    const mousetrapInstance = Mousetrap.bind(keys, callback);
    mousetrapInstance.stopCallback = function (e, element, combo) {
      if ((element as HTMLElement).dataset.mousetrap) {
        return false;
      }

      return (
        element.tagName === 'INPUT' ||
        element.tagName === 'SELECT' ||
        element.tagName === 'TEXTAREA' ||
        (!!(element as HTMLElement).contentEditable && (element as HTMLElement).contentEditable === 'true')
      );
    };

    return () => {
      mousetrapInstance.unbind(keys);
    };
  }, [keys, callback]);
};
