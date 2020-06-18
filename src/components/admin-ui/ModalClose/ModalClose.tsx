import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const ModalClose = ({ children, className, ...props }: IProps) => (
  <button className={classNames('modal-close', className)} {...props}>
    {children}
  </button>
);
