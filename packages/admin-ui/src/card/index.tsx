import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Card = ({ children, className, ...props }: Props) => (
  <div className={classNames('card', className)} {...props}>
    {children}
  </div>
);

export default Card;
