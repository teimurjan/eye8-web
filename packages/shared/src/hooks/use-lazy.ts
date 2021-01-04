import React from 'react';

interface IArgs<T> {
  make: () => T;
  trigger: any;
}

const useLazy = <T>({ make, trigger }: IArgs<T>) => {
  const [value, setValue] = React.useState(make());

  React.useEffect(() => {
    setValue(make());
  }, [make, trigger]);

  return value;
};

export default useLazy;
