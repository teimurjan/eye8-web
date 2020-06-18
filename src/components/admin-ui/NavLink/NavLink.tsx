import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

export interface IProps extends LinkProps {
  className?: string;
  active?: boolean;
}

export const NavLink: React.FC<IProps> = ({ children, className, active, ...props }) => (
  <Link {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={classNames(className, { 'is-active': active })}>{children}</a>
  </Link>
);
