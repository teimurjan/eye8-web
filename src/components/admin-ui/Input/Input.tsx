import classNames from 'classnames';
import * as React from 'react';

export interface IProps {
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

export const Input = React.forwardRef<HTMLInputElement, IProps>(({ className, isDanger, ...props }, ref) => (
  <input ref={ref} className={classNames('input', className, { 'is-danger': isDanger })} {...props} />
));
