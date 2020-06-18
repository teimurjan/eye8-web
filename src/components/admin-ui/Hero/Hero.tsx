import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Hero = ({ children, className, ...props }: IProps) => (
  <div className={classNames('hero', className)} {...props}>
    {children}
  </div>
);
