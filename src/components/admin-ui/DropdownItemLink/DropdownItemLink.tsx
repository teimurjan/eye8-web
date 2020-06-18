import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

export interface IProps extends LinkProps {
  children?: React.ReactNode;
  level?: number;
  className?: string;
}

export const DropdownItemLink = ({ children, className, href, as: as_, ...props }: IProps) => (
  <Link href={href} as={as_} {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={classNames('dropdown-item', className)}>{children}</a>
  </Link>
);
