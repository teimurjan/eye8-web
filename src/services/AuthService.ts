import * as authAPI from 'src/api/AuthAPI';
import * as authStorage from 'src/storage/AuthStorage';
import * as stateCacheStorage from 'src/storage/StateCacheStorage';

export interface IAuthService {
  logIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  confirmSignup(token: string): Promise<void>;
  refreshTokens(): Promise<void>;
  getAccessToken(): string | null;
  logOut(): void;
}

export const errors = {
  EmailExistsError: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  InvalidCredentialsError: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  InvalidSignupToken: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  NoRefreshToken: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class AuthService implements IAuthService {
  private API: authAPI.IAuthAPI;
  private storage: authStorage.IAuthStorage;
  private stateCacheStorage_: stateCacheStorage.IStateCacheStorage;

  constructor(
    API: authAPI.IAuthAPI,
    storage: authStorage.IAuthStorage,
    stateCacheStorage_: stateCacheStorage.IStateCacheStorage,
  ) {
    this.API = API;
    this.storage = storage;
    this.stateCacheStorage_ = stateCacheStorage_;
  }

  public async logIn(email: string, password: string) {
    try {
      const { accessToken, refreshToken } = await this.API.logIn(email, password);

      this.storage.setRefreshToken(refreshToken);
      this.storage.setAccessToken(accessToken);
    } catch (e) {
      if (e instanceof authAPI.errors.EmailOrPasswordInvalidError) {
        throw new errors.InvalidCredentialsError();
      }
      throw e;
    }
  }

  public async signUp(name: string, email: string, password: string) {
    try {
      await this.API.signUp(name, email, password);
    } catch (e) {
      if (e instanceof authAPI.errors.DuplicateEmailError) {
        throw new errors.EmailExistsError();
      }
      throw e;
    }
  }

  public async confirmSignup(token: string) {
    try {
      await this.API.confirmSignup(token);
    } catch (e) {
      if (e instanceof authAPI.errors.SignupNotFound) {
        throw new errors.InvalidSignupToken();
      }
      throw e;
    }
  }

  public async refreshTokens() {
    const oldRefreshToken = this.storage.getRefreshToken();
    if (oldRefreshToken) {
      const { accessToken, refreshToken } = await this.API.refreshTokens(oldRefreshToken);

      this.storage.setRefreshToken(refreshToken);
      this.storage.setAccessToken(accessToken);
    } else {
      throw new errors.NoRefreshToken();
    }
  }

  public getAccessToken() {
    return this.storage.getAccessToken();
  }

  public logOut() {
    this.storage.clearAccessToken();
    this.storage.clearRefreshToken();
    this.stateCacheStorage_.clearAll();
  }
}
