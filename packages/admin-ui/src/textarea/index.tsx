import classNames from 'classnames';
import React from 'react';

export interface Props {
  isDanger?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  value?: string;
  disabled?: boolean;
}

export default React.forwardRef<HTMLTextAreaElement, Props>(({ className, isDanger, ...props }, ref) => (
  <textarea ref={ref} className={classNames('textarea', className, { 'is-danger': isDanger })} {...props} />
));
