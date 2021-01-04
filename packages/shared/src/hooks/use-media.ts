import React from 'react';

import { safeWindow } from '@eye8/shared/utils';

const useMedia = <T>(queries: string[], values: T[], defaultValue: T) => {
  const mediaQueryLists = safeWindow((w) => queries.map((q) => w.matchMedia(q)), []);

  const getValue = () => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  };

  const [value, setValue] = React.useState(getValue);

  React.useEffect(() => {
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach((mql) => mql.addListener(handler));
    return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};

export default useMedia;
