import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardImage = ({ children, className, ...props }: IProps) => (
  <div className={classNames('card-image', className)} {...props}>
    {children}
  </div>
);
