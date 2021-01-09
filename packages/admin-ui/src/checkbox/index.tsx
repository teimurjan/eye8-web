import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLProps<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

const Checkbox = ({ className, label, ...props }: Props) => (
  <label className={classNames('checkbox', className)}>
    <input type="checkbox" {...props} /> {label}
  </label>
);

export default Checkbox;
