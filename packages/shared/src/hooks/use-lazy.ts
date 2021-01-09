import React from 'react';

interface Args<T> {
  make: () => T;
  trigger: any;
}

const useLazy = <T>({ make, trigger }: Args<T>) => {
  const [value, setValue] = React.useState(make());

  React.useEffect(() => {
    setValue(make());
  }, [make, trigger]);

  return value;
};

export default useLazy;
