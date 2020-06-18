/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Title } from 'src/components/admin-ui/Title/Title';
import { LoginFormContainer } from 'src/components/Login/LoginForm/LoginFormContainer';

export const LoginPageView = () => {
  const intl = useIntl();

  return (
    <div
      css={css`
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        max-width: 100%;
        width: 500px;
        position: absolute;
        padding: 10px;
      `}
    >
      <Title
        css={css`
          text-align: center;
        `}
        size={3}
      >
        {intl.formatMessage({ id: 'LoginPage.title' })}
      </Title>
      <LoginFormContainer />
    </div>
  );
};
