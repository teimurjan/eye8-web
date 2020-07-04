import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { safeDocument } from 'src/utils/dom';
import { WatchingValue } from 'src/utils/watching-value';

const DEFAULT_TOAST_DURATION = 5000;
const DEFAULT_TRANSITION_DURATION = 700;
const DEFAULT_TRANSITION_CLASSNAME = 'toast';

let toastKey = 0;

type Toast = { id: number | string; children: React.ReactNode; type: string; duration?: number; delay?: number };
type KeyedToast = Toast & { key: number };

const toastsWV = new WatchingValue<{ [key: string]: KeyedToast }>({});

const durationTimeoutIds: { [key: string]: NodeJS.Timeout } = {};
const delayTimeoutIds: { [key: string]: NodeJS.Timeout } = {};
const setClearToastTimeout = (toast_: Toast) => {
  durationTimeoutIds[toast_.id] = setTimeout(() => {
    clearToast(toast_);
    delete durationTimeoutIds[toast_.id];
  }, (toast_.duration || DEFAULT_TOAST_DURATION) + (toast_.delay || 0));
};
export const toast = (toast_: Toast) => {
  if (toastsWV.get()[toast_.id]) {
    clearTimeout(durationTimeoutIds[toast_.id]);
  }
  if (toast_.duration) {
    setClearToastTimeout(toast_);
  }

  const addToast = () => toastsWV.set({ ...toastsWV.get(), [toast_.id]: { ...toast_, key: toastKey++ } });
  if (toast_.delay) {
    const delayTimeoutId = setTimeout(addToast, toast_.delay);
    delayTimeoutIds[toast_.id] = delayTimeoutId;
  } else {
    addToast();
  }
};

const clearToast = (toast_: Toast) => {
  const newToasts = toastsWV.get();
  delete newToasts[toast_.id];
  toastsWV.set(newToasts);
};

export interface IToastComponentProps {
  componentKey: string;
  status: string;
  close: () => void;
  children: React.ReactNode;
  type: string;
  duration?: number;
  transitionDuration: number;
  transitionClassName: string;
}

export interface IToastContainerProps {
  className?: string;
  render?: (props: IToastComponentProps) => React.ReactNode;
  Component?: React.ComponentClass<IToastComponentProps> | React.SFC<IToastComponentProps>;
  transitionDuration?: number;
  transitionClassName?: string;
}

export const ToastContainer: React.FC<IToastContainerProps> = ({
  className,
  render,
  Component,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  transitionClassName = DEFAULT_TRANSITION_CLASSNAME,
}) => {
  const [toasts, setToasts] = React.useState<KeyedToast[]>([]);

  React.useEffect(() => {
    return toastsWV.watch(toasts_ => {
      setToasts(Object.values(toasts_));
    });
  }, []);

  React.useEffect(() => {
    return () =>
      [durationTimeoutIds, delayTimeoutIds].forEach(timeoutIds => {
        Object.values(timeoutIds).forEach(clearTimeout);
      });
  }, []);

  const toastRoot = useLazyInitialization(
    safeDocument(d => d.getElementById('toastRoot'), null),
    null,
  ).value;

  return toastRoot
    ? ReactDOM.createPortal(
        <TransitionGroup className={className}>
          {toasts.map(toast_ => (
            <CSSTransition key={toast_.id} timeout={transitionDuration} classNames={transitionClassName}>
              {status => {
                const props = {
                  componentKey: toast_.key.toString(),
                  status,
                  close: () => clearToast(toast_),
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
