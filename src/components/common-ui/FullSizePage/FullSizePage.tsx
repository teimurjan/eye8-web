/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Title } from 'src/components/client-ui/Title/Title';

interface IProps {
  background: string;
  color?: string;
  title: string;
  children?: React.ReactNode;
  centered?: boolean;
}

export const FullSizePage = ({ title, color, background, children, centered }: IProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      style={{ background }}
      className={classNames({ centered })}
      css={css`
        height: 100vh;
        width: 100vw;
        transition: background 500ms;
        display: flex;
        align-items: center;

        &.centered {
          text-align: center;
        }
      `}
    >
      <Container>
        <Title
          css={css`
            color: ${color ?? theme.textBrightColor} !important;
          `}
          size={2}
        >
          {title}
        </Title>
        {children}
      </Container>
    </div>
  );
};
