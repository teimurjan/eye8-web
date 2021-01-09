import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const DropdownDivider = ({ children, className, ...props }: Props) => (
  <div className={classNames('dropdown-divider', className)} {...props}>
    {children}
  </div>
);

export default DropdownDivider;
