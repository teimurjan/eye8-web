import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Section = ({ children, className, ...props }: IProps) => (
  <div className={classNames('section', className)} {...props}>
    {children}
  </div>
);
