import {
  AuthAPI,
  LogInPayload,
  SignUpPayload,
  EmailOrPasswordInvalidError,
  DuplicateEmailError,
  SignupNotFoundError,
} from '@eye8/api/auth';
import { decodeAccessToken, AuthorizedUser } from '@eye8/shared/state';
import { AuthStorage } from '@eye8/storage/auth';
import { StateCacheStorage } from '@eye8/storage/state-cache';

export interface AuthService {
  logIn(payload: LogInPayload): Promise<AuthorizedUser>;
  signUp(payload: SignUpPayload): Promise<void>;
  confirmSignup(token: string): Promise<void>;
  getAccessToken(): string | null;
  logOut(): void;
}

export class EmailExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class InvalidCredentialsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class InvalidSignupTokenError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements AuthService {
  private API: AuthAPI;
  private storage: AuthStorage;
  private stateCacheStorage_: StateCacheStorage;

  constructor(API: AuthAPI, storage: AuthStorage, stateCacheStorage_: StateCacheStorage) {
    this.API = API;
    this.storage = storage;
    this.stateCacheStorage_ = stateCacheStorage_;
  }

  public logIn: AuthService['logIn'] = async (payload) => {
    try {
      const { accessToken } = await this.API.logIn(payload);

      this.storage.setAccessToken(accessToken);

      return decodeAccessToken(accessToken);
    } catch (e) {
      if (e instanceof EmailOrPasswordInvalidError) {
        throw new InvalidCredentialsError();
      }
      throw e;
    }
  };

  public signUp: AuthService['signUp'] = async (payload) => {
    try {
      await this.API.signUp(payload);
    } catch (e) {
      if (e instanceof DuplicateEmailError) {
        throw new EmailExistsError();
      }
      throw e;
    }
  };

  public confirmSignup: AuthService['confirmSignup'] = async (token) => {
    try {
      await this.API.confirmSignup(token);
    } catch (e) {
      if (e instanceof SignupNotFoundError) {
        throw new InvalidSignupTokenError();
      }
      throw e;
    }
  };

  public getAccessToken() {
    return this.storage.getAccessToken();
  }

  public logOut() {
    this.storage.clearAccessToken();
    this.stateCacheStorage_.clearAll();
  }
}
