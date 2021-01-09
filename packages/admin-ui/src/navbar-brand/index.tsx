import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const NavbarBrand = ({ children, className, ...props }: Props) => (
  <div className={classNames('navbar-brand', className)} {...props}>
    {children}
  </div>
);

export default NavbarBrand;
