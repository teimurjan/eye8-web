import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const NavbarStart = ({ children, className, ...props }: Props) => (
  <div className={classNames('navbar-start', className)} {...props}>
    {children}
  </div>
);

export default NavbarStart;
