import * as React from 'react';

import { Modal } from 'src/components/client-ui/Modal/Modal';
import { LoginContainer } from 'src/components/Login/LoginContainer';
import { SignUpContainer } from 'src/components/SignUp/SignUpContainer';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useAuthModalState } from 'src/state/AuthModalState';

export const AuthModal = () => {
  const { authModalState } = useAuthModalState();

  const isLoginOpen = authModalState.modalType === 'login';
  const isSignUpOpen = authModalState.modalType === 'signup';
  const { value: isOpen } = useLazyInitialization(isLoginOpen || isSignUpOpen, false);

  const children = React.useMemo(() => {
    if (isLoginOpen) {
      return <LoginContainer />;
    }
    if (isSignUpOpen) {
      return <SignUpContainer />;
    }
  }, [isLoginOpen, isSignUpOpen]);

  return (
    <Modal isOpen={isOpen} close={authModalState.close} fullScreen="mobile" fixed backdrop debounceChildrenOnClose>
      {children}
    </Modal>
  );
};
