import { ClassNames } from '@emotion/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { MessageToast } from '@eye8/client/components/message-toast';
import { IToastsProps, ToastsContext } from '@eye8/shared/context/toast';
import { useLazyInitialization } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';
import { safeDocument } from '@eye8/shared/utils';

const DEFAULT_TRANSITION_DURATION = 700;
const DEFAULT_TRANSITION_CLASSNAME = 'toast';

export const Toasts: React.FC<IToastsProps> = ({
  className,
  render,
  Component,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  transitionClassName = DEFAULT_TRANSITION_CLASSNAME,
}) => {
  const { toasts, hideToast } = React.useContext(ToastsContext);

  const toastRoot = useLazyInitialization(
    safeDocument((d) => d.getElementById('toastRoot'), null),
    null,
  ).value;

  return toastRoot
    ? ReactDOM.createPortal(
        <TransitionGroup className={className}>
          {Object.values(toasts).map((toast_) => (
            <CSSTransition key={toast_.id} timeout={transitionDuration} classNames={transitionClassName}>
              {(status) => {
                const props = {
                  componentKey: toast_.key.toString(),
                  status,
                  close: () => {
                    toast_.onDismiss && toast_.onDismiss();
                    hideToast(toast_);
                  },
                  children: toast_.children,
                  type: toast_.type,
                  duration: toast_.duration,
                  transitionDuration,
                  transitionClassName,
                };

                if (render) {
                  return props;
                }

                if (Component) {
                  return <Component {...props} />;
                }

                return null;
              }}
            </CSSTransition>
          ))}
        </TransitionGroup>,
        toastRoot,
      )
    : null;
};

const Toaster = () => (
  <ClassNames>
    {({ css: css_ }) => (
      <Toasts
        className={css_`
          &:not(:empty) {
            padding: 10px 20px;
          }
          position: fixed;
          top: 0;
          right: 0;
          z-index: 200;
          @media ${mediaQueries.maxWidth768} {
            width: 100%;
            &:not(:empty) {
              padding: 10px;
            }
          }
        `}
        Component={MessageToast}
      />
    )}
  </ClassNames>
);

export default Toaster;
