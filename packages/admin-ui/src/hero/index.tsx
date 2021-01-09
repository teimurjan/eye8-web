import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Hero = ({ children, className, ...props }: Props) => (
  <div className={classNames('hero', className)} {...props}>
    {children}
  </div>
);

export default Hero;
