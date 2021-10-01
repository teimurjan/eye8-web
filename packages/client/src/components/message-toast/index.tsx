
import { css } from '@emotion/react';
import React from 'react';

import { Message } from '@eye8/client-ui';
import { ToastProps } from '@eye8/shared/components';
import { expandHorizontally, mediaQueries, easeOutCubic } from '@eye8/shared/styles';

const MessageToast = ({
  componentKey,
  children,
  close,
  type,
  duration,
  transitionDuration,
  transitionClassName,
}: ToastProps) => {
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

export default MessageToast;
