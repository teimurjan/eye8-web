import * as React from 'react';

export const useBoolean = (defaultValue = false) => {
  const [value, setValue] = React.useState(defaultValue);

  const toggle = React.useCallback(() => {
    setValue(!value);
  }, [value]);

  const setPositive = React.useCallback(() => {
    setValue(true);
  }, []);

  const setNegative = React.useCallback(() => {
    setValue(false);
  }, []);

  return { value, setPositive, setNegative, toggle };
};
