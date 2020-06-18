import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLProps<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

export const Checkbox = ({ className, label, ...props }: IProps) => (
  <label className={classNames('checkbox', className)}>
    <input type="checkbox" {...props} />
    {label}
  </label>
);
