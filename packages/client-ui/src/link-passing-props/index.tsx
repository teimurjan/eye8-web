import Link, { LinkProps } from 'next/link';
import React from 'react';

export interface Props extends LinkProps {
  className?: string;
  children?: React.ReactNode;
}

export default React.forwardRef<HTMLAnchorElement, Props>(({ className, children, ...linkProps }, ref) => (
  <Link {...linkProps}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a ref={ref} className={className}>
      {children}
    </a>
  </Link>
));
