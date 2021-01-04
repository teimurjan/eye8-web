import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

const Radio = ({ className, label, ...props }: IProps) => (
  <label className={classNames('radio', className)}>
    <input type="radio" {...props} />
    {label}
  </label>
);

export default Radio;
