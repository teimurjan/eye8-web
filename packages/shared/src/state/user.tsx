import jwtDecode from 'jwt-decode';
import React from 'react';

import { useDI } from '@eye8/di';

export type AuthorizedUser = {
  user_id: number;
  name: string;
  group: string;
};
export type EmptyUser = null;
export type AnonymousUser = {};
export type User = AuthorizedUser | EmptyUser | AnonymousUser;

export const decodeAccessToken = (accessToken: string): AuthorizedUser => jwtDecode(accessToken);

export interface ContextValue {
  clearUser: () => void;
  syncUser: () => void;
  user: User;
}

const Context = React.createContext<ContextValue | null>(null);

interface ProviderProps {
  children?: React.ReactNode;
}

const USER_NOT_SET_STATE: EmptyUser = null;
const USER_ANONYMOUS_STATE: AnonymousUser = {};

export const UserStateProvider: React.SFC<ProviderProps> = ({ children }) => {
  const {
    di: {
      service: { auth: service },
      storage: { auth: authStorage },
    },
  } = useDI();

  const [user, setUser] = React.useState<User>(USER_NOT_SET_STATE);

  const syncUser = React.useCallback(() => {
    const accessToken = service.getAccessToken();
    try {
      setUser(accessToken ? decodeAccessToken(accessToken) : USER_ANONYMOUS_STATE);
    } catch (e) {
      authStorage.clearAccessToken();
      setUser(USER_ANONYMOUS_STATE);
    }
  }, [authStorage, service]);

  const clearUser = React.useCallback(() => {
    service.logOut();
    setUser(USER_ANONYMOUS_STATE);
  }, [service]);

  return (
    <Context.Provider
      value={{
        clearUser,
        syncUser,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUserState = () => React.useContext(Context) as ContextValue;
