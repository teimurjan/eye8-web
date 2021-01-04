import classNames from 'classnames';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Index = ({ imgProps, className, ...props }: IProps) => (
  <figure className={classNames('image', className)} {...props}>
    <img alt={imgProps.alt} {...imgProps} />
  </figure>
);

export default Index;
