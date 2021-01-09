import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

const PagintationNext = ({ children, className, ...props }: Props) => (
  <a className={classNames('pagination-next', className)} {...props}>
    {children}
  </a>
);

export default PagintationNext;
