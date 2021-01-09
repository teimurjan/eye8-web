import classNames from 'classnames';
import React from 'react';

interface RowProps extends React.HTMLProps<HTMLDivElement> {}

const Row = ({ className, children, ...props }: RowProps) => (
  <div className={classNames('row', className)} {...props}>
    {children}
  </div>
);

interface ColProps extends React.HTMLProps<HTMLDivElement> {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const Col = ({ className, children, xs, sm, md, lg, xl, ...props }: ColProps) => (
  <div
    className={classNames(
      {
        [`col-xs-${xs}`]: xs,
        [`col-sm-${sm}`]: sm,
        [`col-md-${md}`]: md,
        [`col-lg-${lg}`]: lg,
        [`col-xl-${xl}`]: xl,
      },
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const Grid = {
  Row,
  Col,
};

export default Grid;
