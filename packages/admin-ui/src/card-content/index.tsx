import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardContent = ({ children, className, ...props }: Props) => (
  <div className={classNames('card-content', className)} {...props}>
    {children}
  </div>
);

export default CardContent;
