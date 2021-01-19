import { AxiosResponse, AxiosRequestConfig } from 'axios';
import React from 'react';

import { useDI } from '@eye8/di';
import { useToast, ToastId } from '@eye8/shared/context/toast';

export interface Props {
  children: React.ReactElement;
}

const RequestInterceptor = ({ children }: Props) => {
  const {
    di: { __APIClient },
  } = useDI();

  const toast = useToast();

  React.useEffect(() => {
    __APIClient.onError((error: { response?: AxiosResponse; config: AxiosRequestConfig }) => {
      if (error.response && error.response.status === 429) {
        toast({ id: ToastId.TooManyRequests, children: '429: Too many requests error.', type: 'error' });
      }

      throw error;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default RequestInterceptor;
