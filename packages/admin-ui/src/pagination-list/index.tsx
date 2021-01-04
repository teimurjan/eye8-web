import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

const PaginationList = ({ children, className, ...props }: IProps) => (
  <ul className={classNames('pagination-list', className)} {...props}>
    {children}
  </ul>
);

export default PaginationList;
