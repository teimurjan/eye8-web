import * as React from 'react';

export const useForceUpdate = () => {
  const [dep, setDep] = React.useState({});

  const update = React.useCallback(() => {
    setDep({});
  }, []);

  return { dep, update };
};
