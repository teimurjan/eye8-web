import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const NavbarItem = ({ children, className, ...props }: Props) => (
  <div className={classNames('navbar-item', className)} {...props}>
    {children}
  </div>
);

export default NavbarItem;
