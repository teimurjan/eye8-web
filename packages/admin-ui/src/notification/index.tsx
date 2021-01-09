import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  color?: string;
}

const Notification = ({ children, className, color, ...props }: Props) => (
  <div className={classNames('notification', className, color)} {...props}>
    {children}
  </div>
);

export default Notification;
