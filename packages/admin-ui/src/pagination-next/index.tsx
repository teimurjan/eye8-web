import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

const PagintationNext = ({ children, className, ...props }: IProps) => (
  <a className={classNames('pagination-next', className)} {...props}>
    {children}
  </a>
);

export default PagintationNext;
