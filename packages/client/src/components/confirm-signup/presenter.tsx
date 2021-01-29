import { NextRouter } from 'next/router';
import React from 'react';

import { AuthService, InvalidSignupTokenError } from '@eye8/service/auth';

interface Props {
  View: React.ComponentType<ViewProps>;
  service: AuthService;
  router: NextRouter;
}

export interface ViewProps {
  isLoading: boolean;
  error?: string;
}

const ConfirmSignupPresenter = ({ View, service, router }: Props) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;

    (async () => {
      try {
        const token = router.query.token;

        if (token) {
          await service.confirmSignup(typeof token === 'string' ? token : token[0]);
          redirectTimeout = setTimeout(() => router.push('/', '/login'), 3000);
        } else {
          setError('ConfirmSignup.invalidToken');
        }
      } catch (e) {
        if (e instanceof InvalidSignupTokenError) {
          setError('ConfirmSignup.invalidToken');
        } else {
          setError('errors.common');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => clearTimeout(redirectTimeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isLoading={isLoading} error={error} />;
};

export default ConfirmSignupPresenter;
