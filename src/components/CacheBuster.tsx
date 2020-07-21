/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/client-ui/Button/Button';
import { ToastId } from 'src/components/Toast/ids';
import { toast } from 'src/components/Toast/ToastContainer';
import { useDependencies } from 'src/DI/DI';
import { safeWindowOperation } from 'src/utils/dom';

const CACHE_DATE = new Date(21, 7, 2020);
const CACHE_VERSION = CACHE_DATE.getTime().toString();

export const CacheBuster = () => {
  const intl = useIntl();

  const {
    dependencies: {
      storages: { version: versionStorage },
    },
  } = useDependencies();

  React.useEffect(() => {
    const currentVersion = versionStorage.getVersion();
    const bust = () =>
      safeWindowOperation(w => {
        versionStorage.setVersion(CACHE_VERSION);
        w.location.reload(true);
      });

    if (currentVersion && currentVersion !== CACHE_VERSION) {
      toast({
        id: ToastId.CacheBuster,
        children: (
          <>
            {intl.formatMessage({ id: 'cacheBuster.refresh' })}
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
