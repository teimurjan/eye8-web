/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { X as XIcon } from 'react-feather';
import { CSSTransition } from 'react-transition-group';

import { ModalBackground } from 'src/components/admin-ui/ModalBackground/ModalBackground';
import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { Tooltip } from 'src/components/client-ui/Tooltip/Tooltip';
import useClickOutside from 'src/hooks/useClickOutside';
import { useDebounce } from 'src/hooks/useDebounce';
import { useModalScrollLock } from 'src/hooks/useModalScrollLock';
import { useMousetrap } from 'src/hooks/useMousetrap';
import { mediaQueries } from 'src/styles/media';
import { safeDocument } from 'src/utils/dom';

interface IModalCloseProps extends React.HTMLProps<HTMLOrSVGElement> {}

export const ModalClose: React.FC<IModalCloseProps> = ({ className, onClick }) => {
  return (
    <Tooltip
      offset={[0, -10]}
      placement="left"
      renderTrigger={({ open, ref }) => (
        <IconWrapper
          onClick={onClick}
          css={css`
            padding: 20px;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 10px;
          `}
          ref={ref}
          onMouseEnter={open}
          className={className}
        >
          <XIcon />
        </IconWrapper>
      )}
    >
      esc
    </Tooltip>
  );
};

const getFullScreenStyles = (
  styles: string,
  getSelector: (className: string) => string = (className) => `&.${className}`,
) => css`
  @media ${mediaQueries.maxWidth768} {
    ${getSelector('mobileFullScreen')} {
      ${styles}
    }
  }

  @media ${mediaQueries.minWidth768} {
    ${getSelector('desktopFullScreen')} {
      ${styles}
    }
  }

  ${getSelector('fullScreen')} {
    ${styles}
  }
`;

const modalContentCSS = css`
  transition: transform 500ms ease-in-out, opacity 175ms ease-in-out;
  position: absolute;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);
  z-index: 99;

  padding: 20px 30px;

  min-width: 400px;
  max-width: 100%;

  top: 50%;
  left: 50%;

  opacity: 0.5;
  transform: translate(-50%, 50%);

  .popping-enter & {
    opacity: 0;
    transform: translate(-50%, 50%);
  }
  .popping-enter-active &,
  .popping-enter-done & {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  .popping-exit & {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  .popping-exit-active &,
  .popping-exit-done & {
    opacity: 0;
    transform: translate(-50%, 50%);
  }

  &.fixed {
    position: fixed;
  }

  ${getFullScreenStyles('width: 100%;height:100%;')}
`;

const backdropCSS = css`
  opacity: 0;
  z-index: 98;
  transition: opacity 175ms ease-in-out;

  &.fixed {
    position: fixed;
  }

  .popping-enter & {
    opacity: 0;
  }
  .popping-enter-active &,
  .popping-enter-done & {
    opacity: 1;
  }
  .popping-exit & {
    opacity: 1;
  }
  .popping-exit-active &,
  .popping-exit-done & {
    opacity: 0;
  }
`;

const modalCloseCSS = css`
  opacity: 0;
  z-index: 100;
  transition: opacity 175ms ease-in-out;
  color: white;

  .popping-enter & {
    opacity: 0;
  }
  .popping-enter-active &,
  .popping-enter-done & {
    opacity: 1;
  }
  .popping-exit & {
    opacity: 1;
  }
  .popping-exit-active &,
  .popping-exit-done & {
    opacity: 0;
  }
`;

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen: boolean;
  backdrop?: boolean;
  close: () => void;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  lockScroll?: boolean;
  fixed?: boolean;
  showClose?: boolean;
  debounceChildrenOnClose?: boolean;
  fullScreen?: 'desktop' | 'always' | 'mobile';
}

export const Modal = ({
  children,
  className,
  isOpen,
  close,
  onEnter,
  onEntered,
  onExit,
  onExited,
  backdrop,
  lockScroll = true,
  showClose = true,
  fixed,
  debounceChildrenOnClose = false,
  fullScreen,
  ...props
}: IProps) => {
  const theme = useTheme<ClientUITheme>();
  useModalScrollLock(isOpen, lockScroll);

  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside([ref], close, isOpen);
  useMousetrap('esc', close);

  const modalRoot = safeDocument((d) => d.getElementById('modalRoot'), null);

  const debouncedChildren = useDebounce(children, 500);

  return modalRoot
    ? ReactDOM.createPortal(
        <CSSTransition
          in={isOpen}
          timeout={500}
          classNames="popping"
          unmountOnExit
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
          appear
        >
          <div>
            <div
              css={css`
                background: ${theme.backgroundPrimaryColor};
                ${modalContentCSS};
              `}
              className={classNames(className, {
                fixed,
                fullScreen: fullScreen === 'always',
                mobileFullScreen: fullScreen === 'mobile',
                desktopFullScreen: fullScreen === 'desktop',
              })}
              ref={ref}
              {...props}
            >
              {isOpen || !debounceChildrenOnClose ? children : debouncedChildren}
            </div>
            {showClose && (
              <ModalClose
                className={classNames({ fixed })}
                css={css`
                  position: absolute;
                  ${modalCloseCSS};

                  ${getFullScreenStyles(`color: ${theme.textColor};`, (className) => `.${className} + & `)}

                  &.fixed {
                    position: fixed;
                  }
                `}
                onClick={close}
              />
            )}
            {backdrop && <ModalBackground className={classNames({ fixed })} css={backdropCSS}></ModalBackground>}
          </div>
        </CSSTransition>,
        modalRoot,
      )
    : null;
};
