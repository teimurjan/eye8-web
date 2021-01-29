import React from 'react';

import { useAuthModalState } from '@eye8/client/state';
import { Modal } from '@eye8/shared/components';
import { useLazyInitialization } from '@eye8/shared/hooks';

import LoginForm from '../login-form';
import SignUpForm from '../sign-up-form';

const AuthModal = () => {
  const { authModalState } = useAuthModalState();

  const isLoginOpen = authModalState.modalType === 'login';
  const isSignUpOpen = authModalState.modalType === 'signup';
  const { value: isOpen } = useLazyInitialization(isLoginOpen || isSignUpOpen, false);

  const children = React.useMemo(() => {
    if (isLoginOpen) {
      return <LoginForm />;
    }
    if (isSignUpOpen) {
      return <SignUpForm />;
    }
  }, [isLoginOpen, isSignUpOpen]);

  return (
    <Modal isOpen={isOpen} close={authModalState.close} fullScreen="mobile" fixed backdrop debounceChildrenOnClose>
      {children}
    </Modal>
  );
};

export default AuthModal;
