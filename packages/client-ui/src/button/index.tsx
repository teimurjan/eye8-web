/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { mediaQueries } from '@eye8/shared/styles';

export interface Props {
  color?: 'default' | 'dark' | 'primary' | 'info';
  size?: 'default' | 'mini' | 'large' | 'small';
  loading?: boolean;
  disabled?: boolean;
  circled?: boolean;
  squared?: boolean;
  active?: boolean;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  style?: React.CSSProperties;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      color = 'default',
      className,
      loading = false,
      circled = false,
      active = false,
      squared = false,
      type = 'button',
      size,
      onClick,
      onMouseEnter,
      style,
    },
    ref,
  ) => {
    const theme = useTheme<ClientUITheme>();

    return (
      <button
        ref={ref}
        style={style}
        onClick={onClick}
        data-active={active}
        disabled={loading}
        data-loading={loading}
        css={css`
          transition: all 200ms;
          font-size: 16px;
          width: 240px;
          height: 48px;
          cursor: pointer;
          font-weight: 500;
          outline: none;

          &[data-loading='true'] {
            cursor: wait;
          }

          @media ${mediaQueries.maxWidth768} {
            width: 160px;
            height: 36px;
            font-size: 14px;
          }

          &.default {
            color: ${theme.buttonDefaultColor};
            border: 1px solid ${theme.buttonDefaultBorderColor};
            background: ${theme.buttonDefaultBackgroundColor};

            &:hover,
            &[data-active='true'] {
              color: ${theme.buttonDefaultHoverColor};
              background: ${theme.buttonDefaultBackgroundHoverColor};
            }
          }

          &.dark {
            color: ${theme.buttonDarkColor};
            border: 1px solid ${theme.buttonDarkBorderColor};
            background: ${theme.buttonDarkBackgroundColor};

            &:hover,
            &[data-active='true'] {
              color: ${theme.buttonDarkHoverColor};
              background: ${theme.buttonDarkBackgroundHoverColor};
            }
          }

          &.primary {
            color: ${theme.textBrightColor};
            border: none;
            background: ${theme.primaryColor};

            &:hover,
            &[data-active='true'] {
              background: ${theme.buttonPrimaryBackgroundHoverColor};
            }
          }

          &.info {
            color: ${theme.textBrightColor};
            border: none;
            background: ${theme.infoColor};

            &:hover,
            &[data-active='true'] {
              background: ${theme.buttonInfoBackgroundHoverColor};
            }
          }

          &.mini {
            height: auto;
            width: auto;
            padding: 2.5px 5px;
            font-size: 8px;
            text-transform: uppercase;
            font-weight: bold;
          }

          &.small {
            font-size: 12px;
            width: 120px;
            height: 24px;
          }

          &.circled {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            width: 32px;
            height: 32px;

            &.mini {
              width: 18px;
              height: 18px;
            }

            &.large {
              width: 40px;
              height: 40px;
            }
          }

          &.squared {
            border-radius: 0;
          }
        `}
        className={classNames(className, color, size, {
          circled,
          squared,
        })}
        onMouseEnter={onMouseEnter}
        type={type}
      >
        {children}
      </button>
    );
  },
);

export default Button;
