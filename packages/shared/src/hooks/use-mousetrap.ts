import Mousetrap from 'mousetrap';
import React from 'react';

const isEditableElement = (element: HTMLElement) =>
  element.tagName === 'INPUT' ||
  element.tagName === 'SELECT' ||
  element.tagName === 'TEXTAREA' ||
  (element as HTMLElement).contentEditable === 'true';

const useMousetrap = (keys: string | string[], callback: (e: Event) => void, active = true) => {
  const instance = React.useRef<ReturnType<typeof Mousetrap.bind>>(null);

  const bind = React.useCallback(() => {
    // @ts-ignore
    instance.current = Mousetrap.bind(keys, callback);
  }, [keys, callback]);

  const unbind = React.useCallback(() => {
    instance.current?.unbind(keys);
  }, [keys]);

  const initEventsFilter = React.useCallback(() => {
    if (instance.current) {
      instance.current.stopCallback = function (e, element, combo) {
        if ((element as HTMLElement).dataset.mousetrap) {
          return false;
        }

        return isEditableElement(element as HTMLElement);
      };
    }
  }, []);

  React.useEffect(() => {
    if (!active) {
      return unbind;
    }

    bind();
    initEventsFilter();

    return unbind;
  }, [bind, active, unbind, initEventsFilter]);
};

export default useMousetrap;
