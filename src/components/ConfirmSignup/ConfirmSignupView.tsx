/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Title } from 'src/components/client-ui/Title/Title';
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
    <div
      style={{ background: debouncedColor }}
      css={css`
        height: 100vh;
        width: 100vw;
        transition: background 500ms;
        display: flex;
        align-items: center;
      `}
    >
      <Global
        styles={css`
          #${PAGE_LOADER_ID} {
            display: none;
          }
        `}
      />
      <Container>
        <Title
          css={css`
            color: ${theme.textBrightColor};
          `}
          size={2}
        >
          {debouncedContent}
        </Title>
      </Container>
    </div>
  );
};
