import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default ({ children, className, ...props }: IProps) => (
  <button className={classNames('modal-close', className)} {...props}>
    {children}
  </button>
);
