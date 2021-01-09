import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Pagination = ({ children, className, ...props }: Props) => (
  <div className={classNames('pagination', className)} {...props}>
    {children}
  </div>
);

export default Pagination;
