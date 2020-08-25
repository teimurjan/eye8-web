/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { Message } from 'src/components/client-ui/Message/Message';
import { IToastComponentProps } from 'src/components/Toast/ToastContainer';
import { expandHorizontally } from 'src/styles/keyframes';
import { mediaQueries } from 'src/styles/media';
import { easeOutCubic } from 'src/styles/timing-functions';

export const MessageToast = ({
  componentKey,
  children,
  close,
  type,
  duration,
  transitionDuration,
  transitionClassName,
}: IToastComponentProps) => {
  const color = React.useMemo(() => {
    if (type === 'error') {
      return 'error';
    }
    if (type === 'primary') {
      return 'primary';
    }

    return 'default';
  }, [type]);

  return (
    <Message
      key={componentKey}
      css={css`
        &.${transitionClassName}-enter {
          opacity: 0;
          transform: translateX(50px);
        }
        &.${transitionClassName}-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: all ${transitionDuration}ms ${easeOutCubic};
        }
        &.${transitionClassName}-exit {
          opacity: 1;
          transform: translateX(0);
        }
        &.${transitionClassName}-exit-active {
          transform: translateX(50px);
          opacity: 0;
          transition: all ${transitionDuration}ms ${easeOutCubic};
        }

        margin-bottom: 10px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);
        position: relative;

        @media ${mediaQueries.maxWidth768} {
          width: 100%;
        }
      `}
      color={color}
      size="large"
      onCloseClick={close}
    >
      {children}
      <div
        css={css`
          display: block;
          ${duration &&
          css`
            animation: ${expandHorizontally} ${duration}ms linear;
          `}
          animation-fill-mode: forwards;
          transform-origin: 100% 0;
          height: 7px;
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;

          background: rgba(255, 255, 255, 0.7);
        `}
      ></div>
    </Message>
  );
};
