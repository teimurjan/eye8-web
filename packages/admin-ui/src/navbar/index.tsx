import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Index = ({ children, className, ...props }: IProps) => (
  <nav className={classNames('navbar', className)} role="navigation" {...props}>
    {children}
  </nav>
);

export default Index;
