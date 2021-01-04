import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

const Index = ({ children, className, ...props }: IProps) => (
  <label className={classNames('label', className)} {...props}>
    {children}
  </label>
);

export default Index;
