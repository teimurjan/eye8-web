import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

const PaginationList = ({ children, className, ...props }: Props) => (
  <ul className={classNames('pagination-list', className)} {...props}>
    {children}
  </ul>
);

export default PaginationList;
