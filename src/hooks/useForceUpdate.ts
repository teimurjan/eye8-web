import * as React from 'react';

export const useForceUpdate = (): (() => void) => {
  return React.useReducer(() => ({}), {})[1] as () => void;
};
