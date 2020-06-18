import classNames from 'classnames';
import * as React from 'react';

export const Table = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
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

Table.Cell = ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => <td {...props}>{children}</td>;
