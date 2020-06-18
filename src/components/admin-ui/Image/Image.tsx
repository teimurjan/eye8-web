import classNames from 'classnames';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
}

export const Image = ({ imgProps, className, ...props }: IProps) => (
  <figure className={classNames('image', className)} {...props}>
    <img alt={imgProps.alt} {...imgProps} />
  </figure>
);
