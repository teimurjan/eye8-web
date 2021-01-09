import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export interface Props extends LinkProps {
  className?: string;
  active?: boolean;
  children?: React.ReactNode;
}

const NavLink = ({ children, className, active, ...props }: Props) => (
  <Link {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={classNames(className, { 'is-active': active })}>{children}</a>
  </Link>
);

export default NavLink;
