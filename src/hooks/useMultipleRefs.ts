import React from 'react';

export const useMultipleRefs = (...refs: React.Ref<HTMLElement>[]) =>
  React.useCallback(
    input => {
      refs.forEach(r => {
        if (typeof r === 'object' && r !== null) {
          // @ts-ignore
          r.current = input;
        } else if (typeof r === 'function') {
          r(input);
        }
      });
    },
    [refs],
  );
