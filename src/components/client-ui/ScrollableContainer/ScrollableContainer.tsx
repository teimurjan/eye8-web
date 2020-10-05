import * as React from 'react';

interface IProps {
  maxHeight: number;
  children: React.ReactNode;
}

export const ScrollableContainer = ({ maxHeight, children }: IProps) => (
  <div style={{ maxHeight, overflow: 'auto' }}>{children}</div>
);
