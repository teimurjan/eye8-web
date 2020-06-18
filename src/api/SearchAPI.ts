import { Client } from 'ttypes/http';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { IHeadersManager } from 'src/manager/HeadersManager';

export interface ISearchResponseData {
  data: { categories: ICategoryListResponseItem[]; product_types: IProductTypeListResponseItem[] };
}

export interface ISearchAPI {
  search(query: string): Promise<ISearchResponseData>;
}

export class SearchAPI implements ISearchAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async search(query: string) {
    try {
      const response = await this.client.get<ISearchResponseData>(`/api/search/${query}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
