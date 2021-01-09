import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Box = ({ children, className, ...props }: Props) => (
  <div className={classNames('box', className)} {...props}>
    {children}
  </div>
);

export default Box;
