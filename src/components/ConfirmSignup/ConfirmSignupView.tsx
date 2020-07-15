/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { FullSizePage } from 'src/components/common-ui/FullSizePage/FullSizePage';
import { IViewProps as IProps } from 'src/components/ConfirmSignup/ConfirmSignupPresenter';
import { useDebounce } from 'src/hooks/useDebounce';
import { PAGE_LOADER_ID } from 'src/utils/dom';

export const ConfirmSignupView = ({ isLoading, error }: IProps) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();

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
