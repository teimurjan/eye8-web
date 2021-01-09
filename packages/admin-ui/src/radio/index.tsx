import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

const Radio = ({ className, label, ...props }: Props) => (
  <label className={classNames('radio', className)}>
    <input type="radio" {...props} />
    {label}
  </label>
);

export default Radio;
