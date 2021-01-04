import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

const PagintationPrev = ({ children, className, ...props }: IProps) => (
  <a className={classNames('pagination-previous', className)} {...props}>
    {children}
  </a>
);

export default PagintationPrev;
