import React from 'react';

import { useUserState } from '@eye8/shared/state/user';

export const EntryPoint = ({ children }: { children: React.ReactElement }) => {
  const {
    userState: { syncUser },
  } = useUserState();

  React.useEffect(() => {
    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};