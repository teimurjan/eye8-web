import classNames from 'classnames';
import React from 'react';

export interface IProps {
  color?:
    | 'is-primary'
    | 'is-link'
    | 'is-info'
    | 'is-success'
    | 'is-warning'
    | 'is-danger'
    | 'is-white'
    | 'is-light'
    | 'is-dark';
  outlined?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const Index = ({
  children,
  color,
  className,
  loading: isLoading = false,
  outlined,
  type = 'button',
  ...props
}: IProps & React.HTMLProps<HTMLButtonElement>) => (
  <button
    className={classNames('button', className, color, {
      'is-loading': isLoading,
      'is-outlined': outlined,
    })}
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Index;
