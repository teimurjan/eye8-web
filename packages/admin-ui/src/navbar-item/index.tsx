import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default ({ children, className, ...props }: IProps) => (
  <div className={classNames('navbar-item', className)} {...props}>
    {children}
  </div>
);
