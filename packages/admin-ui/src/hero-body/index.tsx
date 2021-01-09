import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const HeroBody = ({ children, className, ...props }: Props) => (
  <div className={classNames('hero-body', className)} {...props}>
    {children}
  </div>
);

export default HeroBody;
