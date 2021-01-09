import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isActive: boolean;
}

const NavbarMenu = ({ children, className, isActive, ...props }: Props) => (
  <div
    className={classNames('navbar-menu', className, {
      'is-active': isActive,
    })}
    {...props}
  >
    {children}
  </div>
);

export default NavbarMenu;
