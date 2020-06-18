import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card = ({ children, className, ...props }: IProps) => (
  <div className={classNames('card', className)} {...props}>
    {children}
  </div>
);
