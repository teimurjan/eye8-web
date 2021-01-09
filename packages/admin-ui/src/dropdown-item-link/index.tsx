import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export interface Props extends LinkProps {
  children?: React.ReactNode;
  level?: number;
  className?: string;
}

const DropdownItemLink = ({ children, className, href, as: as_, ...props }: Props) => (
  <Link href={href} as={as_} {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={classNames('dropdown-item', className)}>{children}</a>
  </Link>
);

export default DropdownItemLink;
