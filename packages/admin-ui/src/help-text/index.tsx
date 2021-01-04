import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  type?: 'is-danger' | 'is-success';
}

export default ({ children, type, className, ...props }: IProps) => (
  <p className={classNames('help', className, type)} {...props}>
    {children}
  </p>
);
