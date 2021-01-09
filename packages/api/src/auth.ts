import { Client } from '@eye8/api/types';
import { HeadersManager } from '@eye8/manager/headers';

export interface AuthResponseData {
  access_token: string;
  refresh_token: string;
}

export interface LogInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthAPI {
  logIn(
    payload: LogInPayload,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  signUp(payload: SignUpPayload): Promise<{}>;
  confirmSignup(token: string): Promise<{}>;
  refreshTokens(
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super('Given email already exists.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class SignupNotFoundError extends Error {
  constructor() {
    super('Invalid signup token.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class EmailOrPasswordInvalidError extends Error {
  constructor() {
    super('Email or password are incorrect.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements AuthAPI {
  private client: Client;
  private headersManager: HeadersManager;

  constructor(client: Client, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public logIn: AuthAPI['logIn'] = async ({ email, password }) => {
    try {
      const response = await this.client.post<AuthResponseData>(
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
        throw new EmailOrPasswordInvalidError();
      }
      throw e;
    }
  };

  public signUp: AuthAPI['signUp'] = async ({ name, email, password }) => {
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
        throw new DuplicateEmailError();
      }
      throw e;
    }
  };

  public async confirmSignup(token: string) {
    try {
      await this.client.post('/api/auth/register/confirm', { token }, { headers: this.headersManager.getHeaders() });
      return {};
    } catch (e) {
      if (e.response.data.email) {
        throw new SignupNotFoundError();
      }
      throw e;
    }
  }

  public async refreshTokens(refreshToken: string) {
    const response = await this.client.post<AuthResponseData>(
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
