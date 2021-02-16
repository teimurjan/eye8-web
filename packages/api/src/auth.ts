import { HeadersManager } from '@eye8/manager/headers';

import { APIClient } from './types';
export interface AuthTokens {
  access_token: string;
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

interface AuthAPI {
  logIn(
    payload: LogInPayload,
  ): Promise<{
    accessToken: string;
  }>;
  signUp(payload: SignUpPayload): Promise<{}>;
  confirmSignup(token: string): Promise<{}>;
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
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public logIn: AuthAPI['logIn'] = async ({ email, password }) => {
    try {
      const response = await this.client.post<AuthTokens>(
        '/api/auth/login',
        {
          email,
          password,
        },
        { headers: this.headersManager.getHeaders() },
      );
      const { access_token: accessToken } = response.data;
      return {
        accessToken,
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
}
