import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

export const PaginationList = ({ children, className, ...props }: IProps) => (
  <ul className={classNames('pagination-list', className)} {...props}>
    {children}
  </ul>
);
