import { AxiosResponse, AxiosRequestConfig } from 'axios';
import React from 'react';

import { useDependencies } from '@eye8/di';
import { useToast, ToastId } from '@eye8/shared/context/toast';

let blockRequestsPromise: Promise<void>;

export interface IProps {
  children: React.ReactElement;
}

const AuthInterceptor = ({ children }: IProps) => {
  const {
    dependencies: {
      __APIClient,
      __headersManager,
      services: { auth: authService },
    },
  } = useDependencies();

  const toast = useToast();

  React.useEffect(() => {
    __APIClient.interceptors.response.use(
      undefined,
      async (error: { response?: AxiosResponse; config: AxiosRequestConfig }) => {
        if (error.response && error.response.status === 429) {
          toast({ id: ToastId.TooManyRequests, children: '429: Too many requests error.', type: 'error' });
        }

        if (error.response && error.response.status === 401) {
          if (!blockRequestsPromise) {
            const tryTokensRefresh = async () => {
              try {
                await authService.refreshTokens();
              } catch (e) {
                authService.logOut();
              }
            };

            blockRequestsPromise = tryTokensRefresh();
          }

          await blockRequestsPromise;

          error.config.headers = __headersManager.getHeaders();

          return __APIClient.request(error.config);
        }

        throw error;
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default AuthInterceptor;
