import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Section = ({ children, className, ...props }: Props) => (
  <div className={classNames('section', className)} {...props}>
    {children}
  </div>
);

export default Section;
