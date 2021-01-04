import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark' | 'is-light';
  size?: 'is-normal' | 'is-medium' | 'is-large';
}

const Message = ({ color = 'is-light', size = 'is-normal', className, children, ...props }: IProps) => (
  <article className={classNames('message', className, color, size)} {...props}>
    {children}
  </article>
);

export interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

Message.Header = ({ children, className, ...props }: IHeaderProps) => (
  <div className={classNames('message-header', className)} {...props}>
    {children}
  </div>
);

export interface IBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

Message.Body = ({ children, className, ...props }: IBodyProps) => (
  <div className={classNames('message-body', className)} {...props}>
    {children}
  </div>
);

export default Message;