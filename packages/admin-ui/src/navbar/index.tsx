import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Navbar = ({ children, className, ...props }: Props) => (
  <nav className={classNames('navbar', className)} role="navigation" {...props}>
    {children}
  </nav>
);

export default Navbar;
