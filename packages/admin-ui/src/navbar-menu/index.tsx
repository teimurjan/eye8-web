import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isActive: boolean;
}

export default ({ children, className, isActive, ...props }: IProps) => (
  <div
    className={classNames('navbar-menu', className, {
      'is-active': isActive,
    })}
    {...props}
  >
    {children}
  </div>
);
