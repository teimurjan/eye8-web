/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import { Modal } from '@eye8/shared/components';
import { useClickOutside, useModalScrollLock, useMousetrap } from '@eye8/shared/hooks';
import { safeDocument } from '@eye8/shared/utils';

type FromSide = 'top' | 'left' | 'bottom' | 'right';

const cssOfSide = {
  top: {
    permanent: css`
      width: 100%;
      top: 0;
      left: 0;
    `,
    initial: css`
      opacity: 0.5;
      transform: translateY(-100%);
    `,
    final: css`
      opacity: 1;
      transform: translateY(0);
    `,
  },
  left: {
    permanent: css`
      height: 100%;
      top: 0;
      left: 0;
    `,
    initial: css`
      opacity: 0.5;
      transform: translateX(-100%);
    `,
    final: css`
      opacity: 1;
      transform: translateX(0);
    `,
  },
  bottom: {
    permanent: css`
      width: 100%;
      bottom: 0;
      left: 0;
    `,
    initial: css`
      opacity: 0.5;
      transform: translateY(100%);
    `,
    final: css`
      opacity: 1;
      transform: translateY(0);
    `,
  },
  right: {
    permanent: css`
      height: 100%;
      top: 0;
      right: 0;
    `,
    initial: css`
      opacity: 0.5;
      transform: translateX(100%);
    `,
    final: css`
      opacity: 1;
      transform: translateX(0);
    `,
  },
};

const getSlidingCSS = (from: FromSide) => {
  const { permanent, initial, final } = cssOfSide[from];

  const drawerContentCSS = css`
    transition: transform 300ms ease-in-out, opacity 175ms ease-in-out;
    position: absolute;
    z-index: 99;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);
    ${permanent};
    ${initial}

    .sliding-enter & {
      ${initial}
    }
    .sliding-enter-active &,
    .sliding-enter-done & {
      ${final}
    }
    .sliding-exit & {
      ${final}
    }
    .sliding-exit-active &,
    .sliding-exit-done & {
      ${initial}
    }

    &.fixed {
      position: fixed;
    }
  `;

  const backdropCSS = css`
    opacity: 0;
    z-index: 98;
    transition: opacity 175ms ease-in-out;

    &.fixed {
      position: fixed;
    }

    .sliding-enter & {
      opacity: 0;
    }
    .sliding-enter-active &,
    .sliding-enter-done & {
      opacity: 1;
    }
    .sliding-exit & {
      opacity: 1;
    }
    .sliding-exit-active &,
    .sliding-exit-done & {
      opacity: 0;
    }
  `;

  const modalCloseCSS = css`
    opacity: 0;
    z-index: 100;
    transition: opacity 175ms ease-in-out;

    .sliding-enter & {
      opacity: 0;
    }
    .sliding-enter-active &,
    .sliding-enter-done & {
      opacity: 1;
    }
    .sliding-exit & {
      opacity: 1;
    }
    .sliding-exit-active &,
    .sliding-exit-done & {
      opacity: 0;
    }
  `;

  return {
    drawerContentCSS,
    backdropCSS,
    modalCloseCSS,
  };
};

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen: boolean;
  backdrop?: boolean;
  fromSide: FromSide;
  close: () => void;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  lockScroll?: boolean;
  fixed?: boolean;
  showClose?: boolean;
}

const Drawer = ({
  children,
  className,
  isOpen,
  fromSide,
  close,
  onEnter,
  onEntered,
  onExit,
  onExited,
  backdrop,
  lockScroll = true,
  showClose = true,
  fixed,
  ...props
}: Props) => {
  const theme = useTheme<ClientUITheme>();
  useModalScrollLock(isOpen, lockScroll);

  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside([ref], close, isOpen);
  useMousetrap('esc', close, isOpen);

  const drawerRoot = safeDocument((d) => d.getElementById('drawerRoot'), null);
  const { drawerContentCSS, backdropCSS, modalCloseCSS } = getSlidingCSS(fromSide);

  return drawerRoot
    ? ReactDOM.createPortal(
        <CSSTransition
          in={isOpen}
          timeout={300}
          classNames="sliding"
          unmountOnExit
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          <div>
            <div css={drawerContentCSS} className={classNames(className, { fixed })} ref={ref} {...props}>
              {children}
            </div>
            {showClose && (
              <Modal.Close
                css={css`
                  position: fixed;
                  ${modalCloseCSS};

                  color: ${theme.textColor};
                `}
                onClick={close}
              />
            )}
            {backdrop && <Modal.Background className={classNames({ fixed })} css={backdropCSS}></Modal.Background>}
          </div>
        </CSSTransition>,
        drawerRoot,
      )
    : null;
};

export default Drawer;
