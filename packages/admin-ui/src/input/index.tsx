import classNames from 'classnames';
import React from 'react';

export interface Props {
  isDanger?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  disabled?: boolean;
}

export default React.forwardRef<HTMLInputElement, Props>(({ className, isDanger, ...props }, ref) => (
  <input ref={ref} className={classNames('input', className, { 'is-danger': isDanger })} {...props} />
));
