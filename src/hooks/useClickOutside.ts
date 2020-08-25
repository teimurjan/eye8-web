import * as React from 'react';

import { safeDocument } from 'src/utils/dom';

export const useClickOutside = (
  refs: React.RefObject<HTMLElement> | Array<React.RefObject<HTMLElement>>,
  callback: () => void,
  attachHandler: boolean,
) => {
  React.useEffect(
    () =>
      safeDocument(
        (d) => {
          const handleClick: EventListener = (e) => {
            // Checks if the element was not removed from the DOM
            // before getting to this handler
            if (e.target && d.body.contains(e.target as Node)) {
              if (Array.isArray(refs)) {
                const refsIncluded = refs.map((ref) => ref.current && ref.current.contains(e.target as Node));
                if (refsIncluded.every((i) => !i)) {
                  callback();
                }
              } else {
                if (refs && refs.current && !refs.current.contains(e.target as Node)) {
                  callback();
                }
              }
            }
          };

          if (attachHandler) {
            d.addEventListener('click', handleClick);
          } else {
            d.removeEventListener('click', handleClick);
          }

          return () => {
            d.removeEventListener('click', handleClick);
          };
        },
        () => {},
      ),
    [callback, refs, attachHandler],
  );
};

export default useClickOutside;
