import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode | string;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Title = ({ children, size, className, ...props }: IProps) =>
  React.createElement(`h${size}`, { className: classNames('title', className, `is-${size}`), ...props }, children);
