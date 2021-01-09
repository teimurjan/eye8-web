/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';

import { IconLink } from '@eye8/admin-ui';
import { useClickOutside, useBoolean } from '@eye8/shared/hooks';

type RenderChildren = (props: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}) => React.ReactNode;

export type TriggerProps = {
  className?: string;
  onClick: React.MouseEventHandler;
};

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode | RenderChildren;
  TriggerComponent?: React.ComponentClass<TriggerProps> | React.StatelessComponent<TriggerProps>;
  trigger?: React.ReactNode | RenderChildren;
  menuClassName?: string;
  align?: 'left' | 'right';
}

const Dropdown = ({
  children,
  className,
  menuClassName,
  TriggerComponent,
  trigger: triggerProp,
  align = 'left',
  ...props
}: Props) => {
  const { value: isOpen, toggle, setNegative: close, setPositive: open } = useBoolean();
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  useClickOutside([contentRef, triggerRef], close, isOpen);

  const trigger = React.useMemo(() => {
    if (TriggerComponent) {
      return <TriggerComponent onClick={toggle} />;
    }

    return typeof triggerProp === 'function' ? triggerProp({ open, close, isOpen, toggle }) : triggerProp;
  }, [TriggerComponent, close, isOpen, open, toggle, triggerProp]);

  return (
    <div className={classNames('dropdown', className, { 'is-active': isOpen }, `is-${align}`)} {...props}>
      <div
        ref={triggerRef}
        css={css`
          width: inherit;
        `}
        className="dropdown-trigger"
      >
        {trigger}
      </div>
      <div className={classNames('dropdown-menu', menuClassName)} role="menu">
        <div ref={contentRef} className="dropdown-content">
          {typeof children === 'function' ? children({ open, close, isOpen, toggle }) : children}
        </div>
      </div>
    </div>
  );
};

const IconTrigger = ({ onClick, icon, className }: TriggerProps & { icon: React.ReactNode }) => {
  const modifiedOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
      }
    },
    [onClick],
  );

  return <IconLink onClick={modifiedOnClick} icon={icon} className={className} />;
};

Dropdown.IconTrigger = IconTrigger;

export default Dropdown;
