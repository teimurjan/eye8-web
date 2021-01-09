import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  isCurrent: boolean;
}

const PaginationLink = ({ children, className, isCurrent, ...props }: Props) => (
  <li {...props}>
    <button className={classNames('pagination-link', { 'is-current': isCurrent })}>{children}</button>
  </li>
);

export default PaginationLink;
