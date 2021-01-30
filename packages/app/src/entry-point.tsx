import React from 'react';

import { useUserState } from '@eye8/shared/state';

const EntryPoint = ({ children }: { children: React.ReactElement }) => {
  const { syncUser } = useUserState();

  React.useEffect(() => {
    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default EntryPoint;
