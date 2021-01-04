import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  isCurrent: boolean;
}

const PaginationLink = ({ children, className, isCurrent, ...props }: IProps) => (
  <li {...props}>
    <button className={classNames('pagination-link', { 'is-current': isCurrent })}>{children}</button>
  </li>
);

export default PaginationLink;
