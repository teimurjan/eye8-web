/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import { ModalBackground } from 'src/components/admin-ui/ModalBackground/ModalBackground';
import { ModalClose } from 'src/components/client-ui/Modal/Modal';
import useClickOutside from 'src/hooks/useClickOutside';
import { useModalScrollLock } from 'src/hooks/useModalScrollLock';
import { useMousetrap } from 'src/hooks/useMousetrap';
import { safeDocument } from 'src/utils/dom';

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

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
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

export const Drawer = ({
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
}: IProps) => {
  const theme = useTheme<ClientUITheme>();
  useModalScrollLock(isOpen, lockScroll);

  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside([ref], close, isOpen);
  useMousetrap('esc', close);

  const drawerRoot = safeDocument(d => d.getElementById('drawerRoot'), null);
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
              <ModalClose
                css={css`
                  position: fixed;
                  ${modalCloseCSS};

                  color: ${theme.textColor};
                `}
                onClick={close}
              />
            )}
            {backdrop && <ModalBackground className={classNames({ fixed })} css={backdropCSS}></ModalBackground>}
          </div>
        </CSSTransition>,
        drawerRoot,
      )
    : null;
};
