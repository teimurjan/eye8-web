import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isActive: boolean;
}

export const NavbarMenu = ({ children, className, isActive, ...props }: IProps) => (
  <div
    className={classNames('navbar-menu', className, {
      'is-active': isActive,
    })}
    {...props}
  >
    {children}
  </div>
);
