import { useRouter } from 'next/router';
import React from 'react';

import { useUserState, User } from '@eye8/shared/state';

type Rule = (user: User) => boolean;

const useProtectedResource = (showRule: Rule, redirectRule?: Rule, redirectPath = '/') => {
  const router = useRouter();
  const { user } = useUserState();

  React.useEffect(() => {
    if (redirectRule && redirectRule(user)) {
      router.push(redirectPath);
    }
  }, [router, redirectRule, user, redirectPath]);

  return showRule(user);
};

export default useProtectedResource;
