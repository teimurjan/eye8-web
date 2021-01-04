import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLProps<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

export default ({ className, label, ...props }: IProps) => (
  <label className={classNames('checkbox', className)}>
    <input type="checkbox" {...props} /> {label}
  </label>
);
