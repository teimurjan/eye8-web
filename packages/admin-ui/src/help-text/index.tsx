import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  type?: 'is-danger' | 'is-success';
}

const HelpText = ({ children, type, className, ...props }: Props) => (
  <p className={classNames('help', className, type)} {...props}>
    {children}
  </p>
);

export default HelpText;
