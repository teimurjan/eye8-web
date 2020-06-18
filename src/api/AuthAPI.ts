import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';

export interface IAuthResponseData {
  access_token: string;
  refresh_token: string;
}

export interface IAuthAPI {
  logIn(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  signUp(name: string, email: string, password: string): Promise<{}>;
  confirmSignup(token: string): Promise<{}>;
  refreshTokens(
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

export const errors = {
  DuplicateEmailError: class extends Error {
    constructor() {
      super('Given email already exists.');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  SignupNotFound: class extends Error {
    constructor() {
      super('Invalid signup token.');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  EmailOrPasswordInvalidError: class extends Error {
    constructor() {
      super('Email or password are incorrect.');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class AuthAPI implements IAuthAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async logIn(email: string, password: string) {
    try {
      const response = await this.client.post<IAuthResponseData>(
        '/api/auth/login',
        {
          email,
          password,
        },
        { headers: this.headersManager.getHeaders() },
      );
      const { access_token: accessToken, refresh_token: refreshToken } = response.data;
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      if (e.response.data.credentials) {
        throw new errors.EmailOrPasswordInvalidError();
      }
      throw e;
    }
  }

  public async signUp(name: string, email: string, password: string) {
    try {
      await this.client.post(
        '/api/auth/register',
        {
          email,
          name,
          password,
        },
        { headers: this.headersManager.getHeaders() },
      );
      return {};
    } catch (e) {
      if (e.response.data.email) {
        throw new errors.DuplicateEmailError();
      }
      throw e;
    }
  }

  public async confirmSignup(token: string) {
    try {
      await this.client.post('/api/auth/register/confirm', { token }, { headers: this.headersManager.getHeaders() });
      return {};
    } catch (e) {
      if (e.response.data.email) {
        throw new errors.SignupNotFound();
      }
      throw e;
    }
  }

  public async refreshTokens(refreshToken: string) {
    const response = await this.client.post<IAuthResponseData>(
      '/api/auth/refresh',
      {
        refresh_token: refreshToken,
      },
      { headers: this.headersManager.getHeaders() },
    );
    const { access_token: accessToken, refresh_token: newRefreshToken } = response.data;
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
