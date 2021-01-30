import { User, AuthorizedUser } from '@eye8/shared/state';

export const isUserAdmin = (user: User) => !!user && 'group' in user && user.group === 'admin';

export const isUserManager = (user: User) => !!user && 'group' in user && user.group === 'manager';

export const isUserAdminOrManager = (user: User) => [isUserAdmin, isUserManager].some((f) => f(user));

export const isUserNotSetYet = (user: User) => user === null;

export const isUserAnonymous = (user: User) => !!user && Object.keys(user).length === 0;

export const isUserAuthorized = (user: User) => !isUserNotSetYet(user) && !isUserAnonymous(user);

export const getUserPropertySafe = (user: User, property: keyof AuthorizedUser, defaultValue?: string) => {
  if (isUserAuthorized(user)) {
    return (user as AuthorizedUser)[property];
  }

  return defaultValue;
};

export const isUserSetAsManagerOrAdmin = (user: User) => !isUserNotSetYet(user) && isUserAdminOrManager(user);

export const isUserSetAsClient = (user: User) => !isUserNotSetYet(user) && !isUserAdminOrManager(user);

export const isUserSetAsAdmin = (user: User) => !isUserNotSetYet(user) && isUserAdmin(user);
