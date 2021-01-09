import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Image = ({ imgProps, className, ...props }: Props) => (
  <figure className={classNames('image', className)} {...props}>
    <img alt={imgProps.alt} {...imgProps} />
  </figure>
);

export default Image;
