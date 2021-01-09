import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const NavbarEnd = ({ children, className, ...props }: Props) => (
  <div className={classNames('navbar-end', className)} {...props}>
    {children}
  </div>
);

export default NavbarEnd;
