
import { css } from '@emotion/react';
import classNames from 'classnames';
import React from 'react';

import { Divider } from '@eye8/client-ui';
import { mediaQueries } from '@eye8/shared/styles';

export interface Props {
  children?: React.ReactNode;
  className?: string;
}

const Menu = ({ children, className }: Props) => <aside className={className}>{children}</aside>;

export interface MenuListProps {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
  collapsed?: boolean;
  direction?: 'column' | 'row';
}

const List = ({ children, className, collapsed, direction = 'column' }: MenuListProps) => {
  const ref = React.useRef<HTMLUListElement>(null);
  const [height, setHeight] = React.useState<number | undefined | 'auto'>(collapsed ? 0 : ref.current?.scrollHeight);

  React.useEffect(() => {
    let timeoutID: NodeJS.Timeout;

    if (!collapsed) {
      setHeight(ref.current?.scrollHeight);
      timeoutID = setTimeout(() => setHeight('auto'), 300);
    } else {
      setHeight(ref.current?.scrollHeight);
      timeoutID = setTimeout(() => setHeight(0), 0);
    }

    return () => clearTimeout(timeoutID);
  }, [collapsed, ref]);

  return (
    <ul
      ref={ref}
      style={{ height }}
      css={css`
        display: flex;
        flex-direction: column;
        margin: 0 !important;
        transition: height 300ms ease-in-out;
        overflow: hidden;

        &.row {
          flex-direction: row;

          @media ${mediaQueries.maxWidth768} {
            flex-direction: column;
          }
        }
      `}
      className={classNames(className, direction)}
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

const Item = ({ children, className }: MenuItemProps) => <li className={className}>{children}</li>;

Menu.Item = Item;
Menu.Divider = Divider;

export default Menu;
