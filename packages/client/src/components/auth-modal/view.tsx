import React from 'react';

import { Modal } from '@eye8/shared/components';
import { useLazyInitialization } from '@eye8/shared/hooks';

import LoginForm from '../login-form';
import SignUpForm from '../sign-up-form';

import { ViewProps } from './presenter';

const AuthModalView = ({ modalType, close }: ViewProps) => {
  const isLoginOpen = modalType === 'login';
  const isSignUpOpen = modalType === 'signup';
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
    <Modal isOpen={isOpen} close={close} fullScreen="mobile" fixed backdrop debounceChildrenOnClose>
      {children}
    </Modal>
  );
};

export default AuthModalView;
