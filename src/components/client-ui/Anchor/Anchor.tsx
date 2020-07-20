/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { useIsTouch } from 'src/hooks/useIsTouch';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';

enum Weight {
  Thin = 'thin',
  Normal = 'normal',
  Bold = 'bold',
}

interface IProps {
  className?: string;
  primary?: boolean;
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
}

export interface AnchorComponent
  extends React.ForwardRefExoticComponent<React.PropsWithoutRef<IProps> & React.RefAttributes<HTMLAnchorElement>> {
  Weight: typeof Weight;
}

export const Anchor = React.forwardRef<HTMLAnchorElement, IProps>(
  (
    {
      className,
      children,
      href,
      as,
      onClick,
      onMouseEnter,
      active,
      weight,
      rel,
      target,
      plain,
      primary,
      noHoverOnTouch,
      shallow,
    },
    ref,
  ) => {
    const theme = useTheme<ClientUITheme>();
    const router = useRouter();

    const modifiedOnClick = React.useCallback(
      e => {
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

    const hoverColor = primary ? theme.primaryColor : theme.anchorColor;

    const anchor = (
      <a
        ref={ref}
        rel={rel}
        target={target}
        className={classNames(className, weight)}
        href={as ? as : href || '#'}
        onClick={modifiedOnClick}
        onMouseEnter={onMouseEnter}
        data-active={active}
        {...lazyDataAttributes}
        css={css`
          color: ${theme.anchorColor};
          transition: color 300ms;
          position: relative;
          display: inline-block;

          &:hover {
            color: ${hoverColor} !important;
          }

          .anchor > &::before {
            content: '';
            position: absolute;
            bottom: -2.5px;
            width: 100%;
            height: 2px;
            transform: translateX(-100%);
            background: ${hoverColor};
            transition: transform 200ms;
          }

          .anchor:hover > &::before,
          &[data-active='true']::before {
            transform: translateX(0);
          }

          .anchor:hover > &[data-ignore-hover='true']::before,
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

    return (
      <div
        className="anchor"
        css={css`
          overflow: hidden;
          cursor: pointer;
          padding: 5px 0;
        `}
      >
        {href && !plain ? (
          <Link href={href} as={as}>
            {anchor}
          </Link>
        ) : (
          anchor
        )}
      </div>
    );
  },
) as AnchorComponent;

Anchor.Weight = Weight;
