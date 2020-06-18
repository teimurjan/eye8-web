import * as React from 'react';

import { useUserState } from 'src/state/UserState';

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
