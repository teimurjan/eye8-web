import { useRouter } from 'next/router';
import React from 'react';

import { useUserState, User } from 'src/state/UserState';

type Rule = (user: User) => boolean;

export const useProtectedResource = (showRule: Rule, redirectRule?: Rule, redirectPath = '/') => {
  const router = useRouter();
  const {
    userState: { user },
  } = useUserState();

  React.useEffect(() => {
    if (redirectRule && redirectRule(user)) {
      router.push(redirectPath);
    }
  }, [router, redirectRule, user, redirectPath]);

  return showRule(user);
};
