import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ModalBackground = ({ children, className, ...props }: Props) => (
  <div className={classNames('modal-background', className)} {...props}>
    {children}
  </div>
);

export default ModalBackground;
