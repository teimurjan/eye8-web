import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';

export interface ILinkButtonProps extends LinkProps {
  color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark';
  outlined?: boolean;
  className?: string;
}

export const LinkButton: React.FC<ILinkButtonProps> = ({ children, color, className, outlined, ...props }) => (
  <Link {...props}>
    <button className={classNames('button', className, color, { 'is-outlined': outlined })}>{children}</button>
  </Link>
);

export interface IReactLinkButtonProps extends ReactRouterLinkProps {
  color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark';
  outlined?: boolean;
}

export const ReactRouterLinkButton: React.FC<IReactLinkButtonProps> = ({
  children,
  color,
  className,
  outlined,
  ...props
}) => (
  <ReactRouterLink className={classNames('button', className, color, { 'is-outlined': outlined })} {...props}>
    {children}
  </ReactRouterLink>
);
