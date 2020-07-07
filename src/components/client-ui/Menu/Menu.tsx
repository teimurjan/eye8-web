/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

import { Divider } from 'src/components/client-ui/Divider/Divider';
import { mediaQueries } from 'src/styles/media';

export interface IProps {
  children?: React.ReactNode;
  className?: string;
}

export const Menu = ({ children, className }: IProps) => <aside className={className}>{children}</aside>;

export interface IMenuListProps {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
  collapsed?: boolean;
  direction?: 'column' | 'row';
}

const List = ({ children, className, collapsed, direction = 'column' }: IMenuListProps) => {
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

export interface IMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
}

const Item = ({ children, className }: IMenuItemProps) => <li className={className}>{children}</li>;

Menu.Item = Item;
Menu.Divider = Divider;
