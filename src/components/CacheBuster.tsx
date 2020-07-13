/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import color from 'color';
import { useTheme } from 'emotion-theming';
import pkgJSON from 'package.json';
import React from 'react';
import ReactDOM from 'react-dom';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/client-ui/Button/Button';
import { useDependencies } from 'src/DI/DI';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { pulse } from 'src/styles/keyframes';
import { mediaQueries } from 'src/styles/media';
import { safeWindowOperation, safeDocument } from 'src/utils/dom';

const CacheBusterButton = ({ onClick }: { onClick: React.MouseEventHandler }) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();
  return (
    <Button
      onClick={onClick}
      color="info"
      css={css`
        position: fixed;
        right: 20px;
        bottom: 20px;
        animation: ${pulse(
            ...color(theme.infoColor)
              .rgb()
              .array(),
          )}
          2000ms infinite;
        width: 250px;
        z-index: 1000;

        @media ${mediaQueries.maxWidth768} {
          right: 15px;
          width: calc(100% - 30px);
        }
      `}
    >
      {intl.formatMessage({ id: 'cacheBuster.refresh' })}
    </Button>
  );
};

export const CacheBuster = () => {
  const {
    dependencies: {
      storages: { version: versionStorage },
    },
  } = useDependencies();

  const currentVersion = versionStorage.getVersion();
  const newVersion = pkgJSON.version;
  const { value: isNewVersionAvailable } = useLazyInitialization(currentVersion === newVersion, false);

  const bust = React.useCallback(() => {
    safeWindowOperation(w => {
      versionStorage.setVersion(newVersion);
      w.location.reload(true);
    });
  }, [versionStorage, newVersion]);

  const mountNode = safeDocument(d => d.querySelector('#cacheBusterRoot'), null);
  return mountNode && isNewVersionAvailable
    ? ReactDOM.createPortal(<CacheBusterButton onClick={bust} />, mountNode)
    : null;
};
