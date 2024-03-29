/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Menu = ({ children, className, ...props }: Props) => (
  <aside className={classNames('menu', className)} {...props}>
    {children}
  </aside>
);

export interface MenuLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

Menu.Label = ({ children, className, ...props }: MenuLabelProps) => (
  <p className={classNames('menu-label', className)} {...props}>
    {children}
  </p>
);

export interface MenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
  collapsed?: boolean;
}

let heightAutoTimeoutID: NodeJS.Timeout;
let height0TimeoutID: NodeJS.Timeout;

const List = ({ children, className, collapsed }: MenuListProps) => {
  const ref = React.useRef<HTMLUListElement>(null);
  const [height, setHeight] = React.useState<number | undefined | 'auto'>(collapsed ? 0 : ref.current?.scrollHeight);

  React.useEffect(() => {
    if (!collapsed) {
      setHeight(ref.current?.scrollHeight);
      heightAutoTimeoutID = setTimeout(() => setHeight('auto'), 300);
    } else {
      setHeight(ref.current?.scrollHeight);
      height0TimeoutID = setTimeout(() => setHeight(0), 0);
    }
  }, [collapsed, ref]);

  React.useEffect(() => () => [heightAutoTimeoutID, height0TimeoutID].forEach(clearTimeout), []);

  return (
    <ul
      ref={ref}
      style={{ height }}
      css={css`
        margin: 0 !important;
        transition: height 300ms ease-in-out;
        overflow: hidden;
      `}
      className={classNames('menu-list', className)}
    >
      {children}
    </ul>
  );
};

Menu.List = List;

export interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
}

Menu.Item = ({ children, className }: MenuListProps) => (
  <li className={classNames('menu-item', className)}>{children}</li>
);

export default Menu;
