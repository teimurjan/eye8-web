import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Section = ({ children, className, ...props }: IProps) => (
  <div className={classNames('section', className)} {...props}>
    {children}
  </div>
);

export default Section;
