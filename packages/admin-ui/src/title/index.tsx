import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode | string;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

const Title = ({ children, size, className, ...props }: Props) =>
  React.createElement(`h${size}`, { className: classNames('title', className, `is-${size}`), ...props }, children);

export default Title;
