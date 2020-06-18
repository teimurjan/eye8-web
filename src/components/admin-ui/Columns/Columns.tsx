import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Columns = ({ children, className, ...props }: IProps) => (
  <div className={classNames('columns', className)} {...props}>
    {children}
  </div>
);
