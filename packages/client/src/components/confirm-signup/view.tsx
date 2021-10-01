
import { css, Global } from '@emotion/react';
import { useTheme } from '@emotion/react';
import React from 'react';
import { useIntl } from 'react-intl';

import { FullSizePage } from '@eye8/client-ui';
import { useDebounce } from '@eye8/shared/hooks';
import { PAGE_LOADER_ID } from '@eye8/shared/utils';

import { ViewProps as Props } from './presenter';

const ConfirmSignupView = ({ isLoading, error }: Props) => {
  const intl = useIntl();
  const theme = useTheme() as ClientUITheme;

  const { content, color } = React.useMemo(() => {
    if (isLoading) {
      return { content: intl.formatMessage({ id: 'common.loading' }), color: theme.primaryColor };
    }

    if (error) {
      return { content: intl.formatMessage({ id: error }), color: theme.dangerColor };
    } else {
      return { content: intl.formatMessage({ id: 'ConfirmSignup.success' }), color: theme.primaryColor };
    }
  }, [error, intl, isLoading, theme]);

  const debouncedContent = useDebounce(content, 500);
  const debouncedColor = useDebounce(color, 500);

  return (
    <FullSizePage title={debouncedContent} background={debouncedColor}>
      <Global
        styles={css`
          #${PAGE_LOADER_ID} {
            display: none;
          }
        `}
      />
    </FullSizePage>
  );
};

export default ConfirmSignupView;
