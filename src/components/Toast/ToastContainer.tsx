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

type Toast = { id: number | string; children: React.ReactNode; type: string; duration?: number };
type KeyedToast = Toast & { key: number };

const toastsWV = new WatchingValue<{ [key: string]: KeyedToast }>({});

const timeoutIds: { [key: string]: NodeJS.Timeout } = {};
const setClearToastTimeout = (toast_: Toast) => {
  timeoutIds[toast_.id] = setTimeout(() => {
    clearToast(toast_);
    delete timeoutIds[toast_.id];
  }, toast_.duration || DEFAULT_TOAST_DURATION);
};
export const toast = (toast_: Toast) => {
  if (toastsWV.get()[toast_.id]) {
    clearTimeout(timeoutIds[toast_.id]);
  }
  if (toast_.duration) {
    setClearToastTimeout(toast_);
  }
  toastsWV.set({ ...toastsWV.get(), [toast_.id]: { ...toast_, key: toastKey++ } });
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
    return () => Object.values(timeoutIds).forEach(clearTimeout);
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
