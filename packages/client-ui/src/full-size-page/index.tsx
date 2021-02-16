/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { Title, Container } from '@eye8/client-ui';

export interface Props {
  background: string;
  color?: string;
  title: string;
  children?: React.ReactNode;
  centered?: boolean;
}

const FullSizePage = ({ title, color, background, children, centered }: Props) => {
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

export default FullSizePage;
