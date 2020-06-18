import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  color: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark' | 'is-light';
  size?: 'is-normal' | 'is-medium' | 'is-large';
}

export const Tag = ({ children, color, size = 'is-normal', className, ...props }: IProps) => (
  <span className={classNames('tag', className, color, size)} {...props}>
    {children}
  </span>
);
