/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import pkgJSON from 'package.json';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/client-ui/Button/Button';
import { ToastId } from 'src/components/Toast/ids';
import { toast } from 'src/components/Toast/ToastContainer';
import { useDependencies } from 'src/DI/DI';
import { safeWindowOperation } from 'src/utils/dom';

export const CacheBuster = () => {
  const intl = useIntl();

  const {
    dependencies: {
      storages: { version: versionStorage },
    },
  } = useDependencies();

  React.useEffect(() => {
    const currentVersion = versionStorage.getVersion();
    const newVersion = pkgJSON.version;
    const bust = () =>
      safeWindowOperation(w => {
        versionStorage.setVersion(newVersion);
        w.location.reload(true);
      });

    if (currentVersion && currentVersion !== newVersion) {
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
          versionStorage.setVersion(newVersion);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
