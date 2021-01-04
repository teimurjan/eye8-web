import {
  IAuthAPI,
  ILogInPayload,
  ISignUpPayload,
  EmailOrPasswordInvalidError,
  DuplicateEmailError,
  SignupNotFoundError,
} from '@eye8/api/auth';
import { decodeAccessToken, AuthorizedUser } from '@eye8/shared/state/user';
import { IAuthStorage } from '@eye8/storage/auth';
import { IStateCacheStorage } from '@eye8/storage/state-cache';

export interface IAuthService {
  logIn(payload: ILogInPayload): Promise<AuthorizedUser>;
  signUp(payload: ISignUpPayload): Promise<void>;
  confirmSignup(token: string): Promise<void>;
  refreshTokens(): Promise<void>;
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
export class NoRefreshTokenError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthService implements IAuthService {
  private API: IAuthAPI;
  private storage: IAuthStorage;
  private stateCacheStorage_: IStateCacheStorage;

  constructor(API: IAuthAPI, storage: IAuthStorage, stateCacheStorage_: IStateCacheStorage) {
    this.API = API;
    this.storage = storage;
    this.stateCacheStorage_ = stateCacheStorage_;
  }

  public logIn: IAuthService['logIn'] = async (payload) => {
    try {
      const { accessToken, refreshToken } = await this.API.logIn(payload);

      this.storage.setRefreshToken(refreshToken);
      this.storage.setAccessToken(accessToken);

      return decodeAccessToken(accessToken);
    } catch (e) {
      if (e instanceof EmailOrPasswordInvalidError) {
        throw new InvalidCredentialsError();
      }
      throw e;
    }
  };

  public signUp: IAuthService['signUp'] = async (payload) => {
    try {
      await this.API.signUp(payload);
    } catch (e) {
      if (e instanceof DuplicateEmailError) {
        throw new EmailExistsError();
      }
      throw e;
    }
  };

  public confirmSignup: IAuthService['confirmSignup'] = async (token) => {
    try {
      await this.API.confirmSignup(token);
    } catch (e) {
      if (e instanceof SignupNotFoundError) {
        throw new InvalidSignupTokenError();
      }
      throw e;
    }
  };

  public refreshTokens: IAuthService['refreshTokens'] = async () => {
    const oldRefreshToken = this.storage.getRefreshToken();
    if (oldRefreshToken) {
      const { accessToken, refreshToken } = await this.API.refreshTokens(oldRefreshToken);

      this.storage.setRefreshToken(refreshToken);
      this.storage.setAccessToken(accessToken);
    } else {
      throw new NoRefreshTokenError();
    }
  };

  public getAccessToken() {
    return this.storage.getAccessToken();
  }

  public logOut() {
    this.storage.clearAccessToken();
    this.storage.clearRefreshToken();
    this.stateCacheStorage_.clearAll();
  }
}
