/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useIsTouch, useLazyInitialization } from '@eye8/shared/hooks';

enum Weight {
  Thin = 'thin',
  Normal = 'normal',
  Bold = 'bold',
}

export interface Props {
  className?: string;
  href?: string;
  as?: string;
  onClick?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  active?: boolean;
  weight?: Weight;
  children: React.ReactNode;
  rel?: string;
  target?: string;
  plain?: boolean;
  noHoverOnTouch?: boolean;
  shallow?: boolean;
  underline?: boolean;
  flex?: boolean;
}

export interface AnchorComponent
  extends React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & React.RefAttributes<HTMLAnchorElement>> {
  Weight: typeof Weight;
}

const Anchor = React.forwardRef<HTMLAnchorElement, Props>(
  (
    {
      className,
      children,
      href,
      as,
      onClick,
      onMouseEnter,
      active,
      weight = Weight.Normal,
      rel,
      target,
      plain,
      noHoverOnTouch,
      shallow,
      underline,
      flex,
    },
    ref,
  ) => {
    const theme = useTheme<ClientUITheme>();
    const router = useRouter();

    const modifiedOnClick = React.useCallback(
      (e) => {
        if (!href) {
          e.preventDefault();
        }

        if (href && shallow) {
          e.preventDefault();
          router.push(href, as, { shallow: true });
        }

        onClick && onClick(e);
      },
      [href, onClick, shallow, router, as],
    );

    const isTouch = useIsTouch();
    const { value: lazyDataAttributes } = useLazyInitialization({ 'data-ignore-hover': noHoverOnTouch && isTouch }, {});

    const anchor = (
      <a
        ref={ref}
        rel={rel}
        target={target}
        className={classNames(className, weight, { underline, flex })}
        href={as ? as : href || '#'}
        onClick={modifiedOnClick}
        onMouseEnter={onMouseEnter}
        data-active={active}
        {...lazyDataAttributes}
        css={css`
          color: ${theme.anchorColor};
          transition: color 300ms;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          padding: 5px 0;
          display: inline-block;
          vertical-align: bottom;

          &.flex {
            display: flex;
            align-items: center;
          }

          &:hover,
          &[data-active='true'] {
            color: ${theme.primaryColor} !important;
          }

          &.underline::before {
            content: '';
            position: absolute;
            bottom: 2.5px;
            width: 100%;
            height: 1px;
            transform: translateX(-100%);
            background: ${theme.primaryColor};
            transition: transform 200ms;
          }

          &:hover::before,
          &[data-active='true']::before {
            transform: translateX(0);
          }

          &:hover[data-ignore-hover='true']::before,
          &[data-active='true'][data-ignore-hover='true']::before {
            transform: translateX(-100%);
          }

          &.thin {
            font-weight: 400;
          }

          &.normal {
            font-weight: 500;
          }

          &.bold {
            font-weight: 600;
          }
        `}
      >
        {children}
      </a>
    );

    return href && !plain ? (
      <Link href={href} as={as}>
        {anchor}
      </Link>
    ) : (
      anchor
    );
  },
) as AnchorComponent;

Anchor.Weight = Weight;

export default Anchor;
