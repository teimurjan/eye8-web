import React from 'react';

import { AuthModalState } from '../../state';

interface Props {
  authModalState: AuthModalState;
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  modalType: AuthModalState['modalType'];
  close: () => void;
}

const AuthModal = ({ View, authModalState }: Props) => (
  <View modalType={authModalState.modalType} close={authModalState.close} />
);

export default AuthModal;
