import classNames from 'classnames';
import React from 'react';

export interface IProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  elementType?: 'a' | 'div';
}

export default ({ elementType = 'a', children, className, onClick, href }: IProps) => {
  const handleClick = React.useCallback(
    (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      if (!href) {
        e.preventDefault();
      }

      if (onClick) {
        onClick();
      }
    },
    [href, onClick],
  );

  return React.createElement(
    elementType,
    { href: href || '#', className: classNames('dropdown-item', className), onClick: handleClick },
    children,
  );
};
