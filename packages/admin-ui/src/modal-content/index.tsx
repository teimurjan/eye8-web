import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ModalContent = ({ children, className, ...props }: Props) => (
  <div className={classNames('modal-content', className)} {...props}>
    {children}
  </div>
);

export default ModalContent;
