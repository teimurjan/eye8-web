import React from 'react';

const usePreventedDefault = <T extends React.SyntheticEvent>(fn: ((e: T) => void) | undefined) =>
  React.useCallback(
    (e: T) => {
      e.preventDefault();
      fn && fn(e);
    },
    [fn],
  );

export default usePreventedDefault;
