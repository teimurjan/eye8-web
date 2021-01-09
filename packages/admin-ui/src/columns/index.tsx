import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Columns = ({ children, className, ...props }: Props) => (
  <div className={classNames('columns', className)} {...props}>
    {children}
  </div>
);

export default Columns;
