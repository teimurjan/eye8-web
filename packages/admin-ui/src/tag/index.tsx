import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  color: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark' | 'is-light';
  size?: 'is-normal' | 'is-medium' | 'is-large';
}

const Tag = ({ color, size = 'is-normal', className, children, ...props }: IProps) => (
  <span className={classNames('tag', className, color, size)} {...props}>
    {children}
  </span>
);

export default Tag;
