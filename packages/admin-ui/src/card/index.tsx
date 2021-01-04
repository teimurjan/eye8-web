import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default ({ children, className, ...props }: IProps) => (
  <div className={classNames('card', className)} {...props}>
    {children}
  </div>
);
