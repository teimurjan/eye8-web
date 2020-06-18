import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const Label = ({ children, className, ...props }: IProps) => (
  <label className={classNames('label', className)} {...props}>
    {children}
  </label>
);
