import classNames from 'classnames';
import React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';

export interface Props extends ReactRouterLinkProps {
  color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark';
  outlined?: boolean;
}

const LinkButton = ({ children, color, className, outlined, ...props }: Props) => (
  <ReactRouterLink className={classNames('button', className, color, { 'is-outlined': outlined })} {...props}>
    {children}
  </ReactRouterLink>
);

export default LinkButton;
