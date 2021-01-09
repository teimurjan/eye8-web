import React from 'react';

import { LoginContainer } from '@eye8/client/components/login-form/container';
import { SignUpContainer } from '@eye8/client/components/sign-up-form/container';
import { useAuthModalState } from '@eye8/client/state/auth-modal';
import { Modal } from '@eye8/shared/components';
import { useLazyInitialization } from '@eye8/shared/hooks';

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
