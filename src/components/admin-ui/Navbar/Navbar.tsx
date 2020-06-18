import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Navbar = ({ children, className, ...props }: IProps) => (
  <nav className={classNames('navbar', className)} role="navigation" {...props}>
    {children}
  </nav>
);
