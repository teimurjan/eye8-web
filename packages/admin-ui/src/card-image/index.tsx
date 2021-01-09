import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardImage = ({ children, className, ...props }: Props) => (
  <div className={classNames('card-image', className)} {...props}>
    {children}
  </div>
);

export default CardImage;
