import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

const Label = ({ children, className, ...props }: Props) => (
  <label className={classNames('label', className)} {...props}>
    {children}
  </label>
);

export default Label;
