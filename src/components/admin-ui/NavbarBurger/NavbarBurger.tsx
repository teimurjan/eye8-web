/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

const spanCSS = css`
  height: 2px !important;
`;

export const NavbarBurger = ({ className, isActive, ...props }: IProps) => (
  <button
    css={css`
      background-color: transparent;
      border: none;

      &:focus {
        background-color: transparent;
        outline: none;
      }
    `}
    className={classNames('navbar-burger burger', className, {
      'is-active': isActive,
    })}
    {...props}
  >
    <span css={spanCSS} aria-hidden="true" />
    <span css={spanCSS} aria-hidden="true" />
    <span css={spanCSS} aria-hidden="true" />
  </button>
);
