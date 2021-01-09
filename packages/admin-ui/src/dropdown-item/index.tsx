import classNames from 'classnames';
import React from 'react';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  elementType?: 'a' | 'div';
}

const DropdownItem = ({ elementType = 'a', children, className, onClick, href }: Props) => {
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

export default DropdownItem;
