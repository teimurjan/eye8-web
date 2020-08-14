import jwtDecode from 'jwt-decode';
import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

export type AuthorizedUser = {
  user_id: number;
  name: string;
  group: string;
};
export type EmptyUser = null;
export type AnonymousUser = {};
export type User = AuthorizedUser | EmptyUser | AnonymousUser;

export const decodeAccessToken = (accessToken: string): AuthorizedUser => jwtDecode(accessToken);

export interface IContextValue {
  userState: {
    clearUser: () => void;
    syncUser: () => void;
    user: User;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

const USER_NOT_SET_STATE: EmptyUser = null;
const USER_ANONYMOUS_STATE: AnonymousUser = {};

export const UserStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { auth: service },
      storages: { auth: authStorage },
    },
  } = useDependencies();

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
        userState: {
          clearUser,
          syncUser,
          user,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUserState = () => React.useContext(Context) as IContextValue;
