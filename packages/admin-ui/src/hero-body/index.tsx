import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Index = ({ children, className, ...props }: IProps) => (
  <div className={classNames('hero-body', className)} {...props}>
    {children}
  </div>
);

export default Index;
