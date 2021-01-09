import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Column = ({ children, className, ...props }: Props) => (
  <div className={classNames('column', className)} {...props}>
    {children}
  </div>
);

export default Column;
