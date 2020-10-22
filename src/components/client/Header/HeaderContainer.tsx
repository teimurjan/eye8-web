import * as React from 'react';

import { HeaderPresenter } from 'src/components/client/Header/HeaderPresenter';
import { HeaderView } from 'src/components/client/Header/HeaderView';
import { useAppState } from 'src/state/AppState';
import { useUserState } from 'src/state/UserState';

export const HeaderContainer = () => {
  const { appState } = useAppState();
  const { userState } = useUserState();

  return <HeaderPresenter appState={appState} userState={userState} View={HeaderView} />;
};