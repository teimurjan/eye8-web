/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';

export type IProps = React.HTMLAttributes<HTMLTableElement>;

const Table = ({ children, className, ...props }: IProps) => (
  <table className={classNames('table', className)} {...props}>
    {children}
  </table>
);

Table.Head = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <thead {...props}>{children}</thead>;

Table.HeadCell = ({ children, ...props }: React.HTMLProps<HTMLTableHeaderCellElement>) => (
  <th {...props}>{children}</th>
);

Table.Foot = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <tfoot {...props}>{children}</tfoot>;

Table.Body = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <tbody {...props}>{children}</tbody>;

Table.Row = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props}>{children}</tr>;

Table.Cell = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ children, ...props }, ref) => (
    <td
      ref={ref}
      css={css`
        vertical-align: middle !important;
      `}
      {...props}
    >
      {children}
    </td>
  ),
);

export default Table;
