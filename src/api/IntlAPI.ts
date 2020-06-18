import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';

export interface IIntlListResponseItem {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface IIntlListResponseData {
  data: IIntlListResponseItem[];
}

export interface IIntlAPI {
  getAll(): Promise<IIntlListResponseData>;
}

export class IntlAPI implements IIntlAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getAll() {
    try {
      const response = await this.client.get<IIntlListResponseData>('/api/languages', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
