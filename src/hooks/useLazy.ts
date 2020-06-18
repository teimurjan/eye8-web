import * as React from 'react';

interface IArgs<T> {
  make: () => T;
  trigger: any;
}

export const useLazy = <T>({ make, trigger }: IArgs<T>) => {
  const [value, setValue] = React.useState(make());

  React.useEffect(() => {
    setValue(make());
  }, [make, trigger]);

  return value;
};
