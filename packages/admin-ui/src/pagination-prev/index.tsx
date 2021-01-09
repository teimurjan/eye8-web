import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

const PagintationPrev = ({ children, className, ...props }: Props) => (
  <a className={classNames('pagination-previous', className)} {...props}>
    {children}
  </a>
);

export default PagintationPrev;
