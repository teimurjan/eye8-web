import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  type?: 'is-danger' | 'is-success';
}

export const HelpText = ({ children, type, className, ...props }: IProps) => (
  <p className={classNames('help', className, type)} {...props}>
    {children}
  </p>
);
