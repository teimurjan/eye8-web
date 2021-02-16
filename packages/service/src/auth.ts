import {
  LogInPayload,
  SignUpPayload,
  DuplicateEmailError,
  EmailOrPasswordInvalidError,
  SignupNotFoundError,
  AuthAPI,
} from '@eye8/api';
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

export { DuplicateEmailError, EmailOrPasswordInvalidError, SignupNotFoundError };

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
        throw new EmailOrPasswordInvalidError();
      }
      throw e;
    }
  };

  public signUp: AuthService['signUp'] = async (payload) => {
    try {
      await this.API.signUp(payload);
    } catch (e) {
      if (e instanceof DuplicateEmailError) {
        throw new DuplicateEmailError();
      }
      throw e;
    }
  };

  public confirmSignup: AuthService['confirmSignup'] = async (token) => {
    try {
      await this.API.confirmSignup(token);
    } catch (e) {
      if (e instanceof SignupNotFoundError) {
        throw new SignupNotFoundError();
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
