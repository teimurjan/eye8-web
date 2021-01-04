import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export interface IProps extends LinkProps {
  children?: React.ReactNode;
  level?: number;
  className?: string;
}

const Index = ({ children, className, href, as: as_, ...props }: IProps) => (
  <Link href={href} as={as_} {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={classNames('dropdown-item', className)}>{children}</a>
  </Link>
);

export default Index;
