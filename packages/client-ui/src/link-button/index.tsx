import Link, { LinkProps } from 'next/link';
import React from 'react';

import { Button, ButtonProps } from '@eye8/client-ui';

export type Props = LinkProps & ButtonProps;

const LinkButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      color,
      loading,
      disabled,
      type,
      children,
      size,
      squared,
      circled,
      onClick,
      onMouseEnter,
      ...linkProps
    },
    ref,
  ) => (
    <Link {...linkProps}>
      <Button
        ref={ref}
        color={color}
        className={className}
        loading={loading}
        disabled={disabled}
        squared={squared}
        circled={circled}
        type={type}
        size={size}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </Button>
    </Link>
  ),
);

export default LinkButton;
