import * as React from 'react';

export const useLazyInitialization = <T>(actualValue: T, defaultValue: T) => {
  const [trigger, setTrigger] = React.useState(false);

  React.useEffect(() => {
    const timeoutID = setTimeout(() => setTrigger(true), 0);
    return () => clearTimeout(timeoutID);
  }, []);

  const value = trigger ? actualValue : defaultValue;

  return { value, isInitialized: trigger };
};
