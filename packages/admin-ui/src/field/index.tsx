import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Field = ({ children, className, ...props }: Props) => (
  <div className={classNames('field', className)} {...props}>
    {children}
  </div>
);

export default Field;
