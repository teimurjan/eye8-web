import React from 'react';

import { noop } from '@eye8/shared/utils';

export enum ToastId {
  TooManyRequests,
  LoginSuccessful,
  LogoutSuccessful,
  CacheBuster,
}

const DEFAULT_TOAST_DURATION = 5000;

type Toast = {
  id: number | string;
  children: React.ReactNode;
  type: string;
  duration?: number;
  delay?: number;
  onDismiss?: () => void;
};
type KeyedToast = Toast & { key: number };

interface IToastsContextValue {
  toasts: { [key: string]: KeyedToast };
  toast: (toast: Toast) => void;
  hideToast: (toast: Toast) => void;
}

interface IToastsContextProviderProps {
  children: React.ReactElement;
}

export const ToastsContext = React.createContext<IToastsContextValue>({ toasts: {}, toast: noop, hideToast: noop });

let toastKey = 0;
const durationTimeoutIds: { [key: string]: NodeJS.Timeout } = {};
const delayTimeoutIds: { [key: string]: NodeJS.Timeout } = {};

export const ToastsProvider = ({ children }: IToastsContextProviderProps) => {
  const [toasts, setToasts] = React.useState<{ [key: string]: KeyedToast }>({});

  const hideToast = React.useCallback(
    (toast_: Toast) => {
      const newToasts = { ...toasts };
      delete newToasts[toast_.id];
      setToasts(newToasts);
    },
    [toasts],
  );

  const toastFn = React.useCallback(
    (toast: Toast) => {
      if (toasts[toast.id]) {
        clearTimeout(durationTimeoutIds[toast.id]);
      }

      if (toast.duration) {
        durationTimeoutIds[toast.id] = setTimeout(() => {
          hideToast(toast);
          delete durationTimeoutIds[toast.id];
        }, (toast.duration || DEFAULT_TOAST_DURATION) + (toast.delay || 0));
      }

      const addToast = () => setToasts({ ...toasts, [toast.id]: { ...toast, key: toastKey++ } });
      if (toast.delay) {
        const delayTimeoutId = setTimeout(addToast, toast.delay);
        delayTimeoutIds[toast.id] = delayTimeoutId;
      } else {
        addToast();
      }
    },
    [toasts, hideToast],
  );

  React.useEffect(() => {
    return () =>
      [durationTimeoutIds, delayTimeoutIds].forEach((timeoutIds) => {
        Object.values(timeoutIds).forEach(clearTimeout);
      });
  }, []);

  return <ToastsContext.Provider value={{ toasts, toast: toastFn, hideToast }}>{children}</ToastsContext.Provider>;
};

export interface IToastProps {
  componentKey: string;
  status: string;
  close: () => void;
  children: React.ReactNode;
  type: string;
  duration?: number;
  transitionDuration: number;
  transitionClassName: string;
}

export interface IToastsProps {
  className?: string;
  render?: (props: IToastProps) => React.ReactNode;
  Component?: React.ComponentClass<IToastProps> | React.SFC<IToastProps>;
  transitionDuration?: number;
  transitionClassName?: string;
}

export const useToast = () => React.useContext(ToastsContext).toast;
