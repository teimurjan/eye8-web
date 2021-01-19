/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@eye8/client-ui';
import { useDI } from '@eye8/di';
import { useToast, ToastId } from '@eye8/shared/context/toast';
import { safeWindowOperation } from '@eye8/shared/utils';

const CACHE_DATE = new Date(2020, 7, 21);
const CACHE_VERSION = CACHE_DATE.getTime().toString();

export const CacheBuster = () => {
  const intl = useIntl();

  const {
    di: {
      storage: { version: versionStorage },
    },
  } = useDI();

  const toast = useToast()

  React.useEffect(() => {
    const currentVersion = versionStorage.getVersion();
    const bust = () =>
      safeWindowOperation((w) => {
        versionStorage.setVersion(CACHE_VERSION);
        w.location.reload(true);
      });

    if (currentVersion && currentVersion !== CACHE_VERSION) {
      toast({
        id: ToastId.CacheBuster,
        children: (
          <>
            {intl.formatMessage({ id: 'cacheBuster.refresh' }, { shopName: process.env.SHOP_NAME })}
            <br />
            <Button
              css={css`
                margin: 5px 0;
                text-transform: uppercase;
              `}
              onClick={bust}
              size="small"
            >
              {intl.formatMessage({ id: 'cacheBuster.refresh.action' })}
            </Button>
          </>
        ),
        type: 'primary',
        onDismiss: () => {
          versionStorage.setVersion(CACHE_VERSION);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
