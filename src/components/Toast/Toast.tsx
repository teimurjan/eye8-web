/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Message, IProps as IMessageProps } from 'src/components/client-ui/Message/Message';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { easeOutCubic } from 'src/styles/timing-functions';
import { safeDocument } from 'src/utils/dom';
import { WatchingValue } from 'src/utils/watching-value';

export enum ToastId {
  TooManyRequests,
}

type Toast = { id: number | string; text: string; color: IMessageProps['color'] };

const toastsWV = new WatchingValue<{ [key: string]: Toast }>({});

const timeoutIds: { [key: string]: NodeJS.Timeout } = {};
const setClearToastTimeout = (toast_: Toast) => {
  timeoutIds[toast_.id] = setTimeout(() => {
    clearToast(toast_);
    delete timeoutIds[toast_.id];
  }, 5000);
};
export const toast = (toast_: Toast) => {
  if (toastsWV.get()[toast_.id]) {
    clearTimeout(timeoutIds[toast_.id]);
    setClearToastTimeout(toast_);
  } else {
    setClearToastTimeout(toast_);
    toastsWV.set({ ...toastsWV.get(), [toast_.id]: toast_ });
  }
};

const clearToast = (toast_: Toast) => {
  const newToasts = toastsWV.get();
  delete newToasts[toast_.id];
  toastsWV.set(newToasts);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    return toastsWV.watch(toasts_ => {
      setToasts(Object.values(toasts_));
    });
  }, []);

  React.useEffect(() => {
    return () => Object.values(timeoutIds).forEach(clearTimeout);
  }, []);

  const toastRoot = useLazyInitialization(
    safeDocument(d => d.getElementById('toastRoot'), null),
    null,
  ).value;

  return toastRoot
    ? ReactDOM.createPortal(
        <TransitionGroup
          css={css`
            position: fixed;
            top: 0;
            right: 0;
            padding: 10px 20px;
            z-index: 200;
          `}
        >
          {toasts.map(toast_ => (
            <CSSTransition key={toast_.id} timeout={700} classNames="toast">
              <Message
                css={css`
                  &.toast-enter {
                    opacity: 0;
                    transform: translateX(50px);
                  }
                  &.toast-enter-active {
                    opacity: 1;
                    transform: translateX(0);
                    transition: all 700ms ${easeOutCubic};
                  }
                  &.toast-exit {
                    opacity: 1;
                    transform: translateX(0);
                  }
                  &.toast-exit-active {
                    transform: translateX(50px);
                    opacity: 0;
                    transition: all 700ms ${easeOutCubic};
                  }

                  margin-bottom: 10px;
                  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);
                `}
                color={toast_.color}
                size="large"
                onCloseClick={() => clearToast(toast_)}
              >
                {toast_.text}
              </Message>
            </CSSTransition>
          ))}
        </TransitionGroup>,
        toastRoot,
      )
    : null;
};
