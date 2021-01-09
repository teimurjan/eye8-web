import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Control = ({ children, className, ...props }: Props) => (
  <div className={classNames('control', className)} {...props}>
    {children}
  </div>
);

export default Control;
