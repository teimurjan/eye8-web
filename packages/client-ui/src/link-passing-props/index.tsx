import Link, { LinkProps } from 'next/link';
import React from 'react';

export interface IProps extends LinkProps {
  className?: string;
  children?: React.ReactNode;
}

export default React.forwardRef<HTMLAnchorElement, IProps>(({ className, children, ...linkProps }, ref) => (
  <Link {...linkProps}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a ref={ref} className={className}>
      {children}
    </a>
  </Link>
));
