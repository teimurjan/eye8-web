import { useRouter } from 'next/router';
import * as React from 'react';

type ModalType = 'login' | 'signup';

export interface IContextValue {
  authModalState: {
    modalType?: ModalType;
    close: () => void;
    open: (modalType: ModalType) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

export const AuthModalStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const router = useRouter();

  const [modalType, setModalType] = React.useState<ModalType | undefined>(undefined);

  const modalTypeFromRoute = React.useMemo(() => {
    return ['login', 'signup'].find(type => router.asPath.startsWith(`/${type}`));
  }, [router]) as ModalType | undefined;

  const close = () => {
    if (modalTypeFromRoute) {
      router.push('/', '/', { shallow: true });
    } else {
      setModalType(undefined);
    }
  };

  const open = (modalType: ModalType) => {
    if (modalTypeFromRoute) {
      router.push('/', `/${modalType}`, { shallow: true });
    } else {
      setModalType(modalType);
    }
  };

  return (
    <Context.Provider
      value={{
        authModalState: {
          modalType: modalTypeFromRoute ? modalTypeFromRoute : modalType,
          close,
          open,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthModalState = () => React.useContext(Context) as IContextValue;
