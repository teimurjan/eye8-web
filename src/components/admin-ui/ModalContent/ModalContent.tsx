import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ModalContent = ({ children, className, ...props }: IProps) => (
  <div className={classNames('modal-content', className)} {...props}>
    {children}
  </div>
);
