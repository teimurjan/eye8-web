import React from 'react';

const useForceUpdate = () => {
  const [dep, setDep] = React.useState({});

  const update = React.useCallback(() => {
    setDep({});
  }, []);

  return { dep, update };
};

export default useForceUpdate;
