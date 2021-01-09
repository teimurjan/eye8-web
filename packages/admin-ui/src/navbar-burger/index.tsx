/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

const spanCSS = css`
  height: 2px !important;
`;

const NavbarBurger = ({ className, isActive, ...props }: Props) => (
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

export default NavbarBurger;
