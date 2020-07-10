/** @jsx jsx */
import { css, jsx, ClassNames } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { usePopper, PopperProps } from 'react-popper';
import { CSSTransition } from 'react-transition-group';

import { useBoolean } from 'src/hooks/useBoolean';
import useClickOutside from 'src/hooks/useClickOutside';
import { useDebounce } from 'src/hooks/useDebounce';
import { useIsTouch } from 'src/hooks/useIsTouch';
import useMouseOutside from 'src/hooks/useMouseOutside';
import { safeDocument } from 'src/utils/dom';

export const poppingCSS = css`
  opacity: 0;
  transition: opacity 300ms ease-in-out, transform 175ms ease-in-out;

  .popping-enter & {
    opacity: 0;
    transform: translateY(10px);
  }
  .popping-enter-active &,
  .popping-enter-done & {
    opacity: 1;
    transform: translateY(0);
  }
  .popping-exit & {
    opacity: 1;
    transform: translateY(0);
  }
  .popping-exit-active &,
  .popping-exit-done & {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

export type RenderChildren = (props: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
  update: (() => void) | null;
}) => React.ReactNode;

export type RenderTrigger<T> = (props: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
  ref: React.RefObject<T>;
}) => React.ReactNode;

export type TriggerClickProps = {
  onClick: React.MouseEventHandler;
};
export type TriggerHoverProps = {
  onMouseEnter: React.MouseEventHandler;
  onClick: React.MouseEventHandler;
};
type TriggerClickComponent<T> = React.ComponentType<TriggerClickProps & React.RefAttributes<T>>;
type TriggerHoverComponent<T> = React.ComponentType<TriggerHoverProps & React.RefAttributes<T>>;

export interface IProps<T> {
  TriggerComponent?: TriggerClickComponent<T> | TriggerHoverComponent<T>;
  renderTrigger?: RenderTrigger<T>;
  hasArrow?: boolean;
  children?: React.ReactNode | RenderChildren;
  forceClose?: boolean;
  forceOpen?: boolean;
  preventOverflow?: boolean;
  openOnHover?: boolean;
  placement?: PopperProps['placement'];
  offset?: number[];
  refsToInclude?: React.RefObject<HTMLElement>[];
  arrowClassName?: string;
  delay?: number;
  closeOnClick?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
}

export const Popover = <T extends HTMLElement>({
  TriggerComponent,
  renderTrigger,
  hasArrow = false,
  children,
  forceClose = false,
  forceOpen = false,
  preventOverflow = true,
  placement = 'bottom-start',
  openOnHover = false,
  refsToInclude = [],
  offset = [0, 10],
  arrowClassName,
  delay = 0,
  closeOnClick = false,
  onEnter,
  onEntered,
}: IProps<T>) => {
  const popoverRoot = safeDocument(d => d.getElementById('popoverRoot'), null);

  const { value: isOpen, toggle, setNegative: close, setPositive: open } = useBoolean();
  const isOpenDebounced = useDebounce(isOpen, delay);
  const isOpenMemoized = React.useMemo(() => {
    if (forceOpen) {
      return true;
    }

    if (forceClose) {
      return false;
    }

    return isOpenDebounced;
  }, [forceClose, forceOpen, isOpenDebounced]);

  const triggerRef = React.useRef<T>(null);
  const [popperRef, setPopperRef] = React.useState<HTMLDivElement | null>(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLDivElement | null>(null);

  const isTouch = useIsTouch();
  const shouldOpenOnHover = openOnHover && !isTouch;
  const outsideRefs = React.useMemo(() => [{ current: popperRef }, triggerRef, ...refsToInclude], [
    popperRef,
    triggerRef,
    refsToInclude,
  ]);

  useClickOutside(outsideRefs, close, isOpenMemoized);
  useMouseOutside(outsideRefs, close, shouldOpenOnHover && isOpenMemoized);

  const modifiers = React.useMemo(() => {
    const modifiers_ = [];
    if (hasArrow) {
      modifiers_.push({ name: 'arrow', options: { element: arrowRef } });
    }
    if (preventOverflow) {
      modifiers_.push({ name: 'preventOverflow', enabled: true, options: { escapeWithReference: true } });
    }
    if (offset) {
      modifiers_.push({ name: 'offset', enabled: true, options: { offset } });
    }
    return modifiers_;
  }, [hasArrow, arrowRef, preventOverflow, offset]);

  const popper = usePopper(triggerRef.current, popperRef, { modifiers, placement });
  React.useEffect(() => {
    if (isOpenMemoized && popper.update) {
      popper.update();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenMemoized, !popper.update]);

  const trigger = React.useMemo(() => {
    if (renderTrigger) {
      return renderTrigger({ ref: triggerRef, open, close, isOpen, toggle });
    }

    if (TriggerComponent) {
      return shouldOpenOnHover
        ? React.createElement(TriggerComponent as TriggerHoverComponent<T>, {
            ref: triggerRef,
            onMouseEnter: open,
            onClick: open,
          })
        : React.createElement(TriggerComponent as TriggerClickComponent<T>, { ref: triggerRef, onClick: open });
    }

    return null;
  }, [renderTrigger, TriggerComponent, open, close, isOpen, toggle, shouldOpenOnHover]);

  return (
    <>
      {trigger}

      {popoverRoot
        ? ReactDOM.createPortal(
            <CSSTransition
              in={isOpenMemoized}
              timeout={300}
              classNames="popping"
              onEnter={onEnter}
              onEntered={onEntered}
              mountOnEnter
              unmountOnExit
            >
              <div
                css={css`
                  z-index: 100;
                `}
                ref={setPopperRef}
                style={popper.styles.popper}
                {...popper.attributes.popper}
              >
                <div
                  css={css`
                    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);

                    ${poppingCSS};
                  `}
                  onClick={closeOnClick ? close : undefined}
                >
                  {typeof children === 'function'
                    ? children({ open, close, isOpen, toggle, update: popper.update })
                    : children}
                  {hasArrow && (
                    <div
                      ref={setArrowRef}
                      style={popper.styles.arrow}
                      data-placement={placement}
                      css={css`
                        &[data-placement*='bottom'] {
                          top: 0;
                          margin-top: -3.75px;
                        }
                        &[data-placement*='top'] {
                          bottom: 0;
                          margin-bottom: -3.75px;
                        }
                        &[data-placement*='right'] {
                          left: 0;
                          margin-right: -3.75px;
                        }
                        &[data-placement*='left'] {
                          right: 0;
                          margin-right: -3.75px;
                        }
                      `}
                    >
                      <div
                        className={arrowClassName}
                        css={css`
                          width: 7.5px;
                          height: 7.5px;
                          transform: rotate(45deg);
                        `}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </CSSTransition>,
            popoverRoot,
          )
        : null}
    </>
  );
};

export interface IPopoverContentProps {
  className?: string;
  children?: React.ReactNode;
}

const PopoverContent = React.forwardRef<HTMLDivElement, IPopoverContentProps>(({ children, className }, ref) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      ref={ref}
      className={className}
      css={css`
        background: ${theme.backgroundPrimaryColor};
        padding: 10px 20px;
        width: 200px;
      `}
    >
      {children}
    </div>
  );
});

Popover.Content = PopoverContent;

enum Color {
  Default = 'default',
  Dark = 'dark',
}

export interface IPopoverItemProps<T> {
  className?: string;
  children?: React.ReactNode;
  Component: React.ComponentType<T> | 'div';
  color?: Color;
}

const PopoverItem = <T extends object = {}>({
  className,
  Component,
  color = Color.Default,
  ...props
}: IPopoverItemProps<T> & T) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <ClassNames>
      {({ css: css_ }) => (
        <Component
          className={classNames(
            className,
            css_`
              cursor: pointer;
              padding: 10px 20px;
              color: ${theme.textColor};
              background: ${theme.backgroundPrimaryColor};

              &:hover {
                background: ${theme.backgroundPrimaryHoverColor};
              }

              &.dark {
                color: ${theme.textBrightColor};
                background: ${theme.backgroundDarkColor};

                &:hover {
                  background: ${theme.backgroundDarkHoverColor};
                } 
              }
            `,
            color,
          )}
          /* TODO: Get rid of any */
          {...(props as any)}
        />
      )}
    </ClassNames>
  );
};

PopoverItem.Color = Color;

Popover.Item = PopoverItem;
