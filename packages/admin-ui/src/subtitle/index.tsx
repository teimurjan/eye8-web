import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

const Subtitle = ({ children, size, className, ...props }: IProps) =>
  React.createElement(`h${size}`, { className: classNames('subtitle', className, `is-${size}`), ...props }, children);

export default Subtitle;
