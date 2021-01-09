import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const ModalClose = ({ children, className, ...props }: Props) => (
  <button className={classNames('modal-close', className)} {...props}>
    {children}
  </button>
);

export default ModalClose;
