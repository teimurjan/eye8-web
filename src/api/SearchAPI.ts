import { Client } from 'ttypes/http';

import { ICategoryListResponseItem, ICategoryListRawIntlResponseItem } from 'src/api/CategoryAPI';
import { IProductTypeListResponseItem, IProductTypeListRawIntlResponseItem } from 'src/api/ProductTypeAPI';
import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/queryString';

export type SearchProductTypeResponseItem = Omit<IProductTypeListResponseItem, 'description'>;
export type SearchProductTypeRawIntlResponseItem = Omit<IProductTypeListRawIntlResponseItem, 'description'>;

export interface ISearchResponseData {
  data: { categories: ICategoryListResponseItem[]; product_types: SearchProductTypeResponseItem[] };
}

export interface ISearchRawIntlResponseData {
  data: { categories: ICategoryListRawIntlResponseItem[]; product_types: SearchProductTypeRawIntlResponseItem[] };
}

export interface ISearchAPI {
  search(query: string, available?: boolean): Promise<ISearchResponseData>;
  searchRawIntl(query: string): Promise<ISearchRawIntlResponseData>;
}

export class SearchAPI implements ISearchAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async search(query: string, available = true) {
    try {
      const response = await this.client.get<ISearchResponseData>(
        `/api/search/${query}${buildSearchString({ available: available ? 1 : 0 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async searchRawIntl(query: string) {
    try {
      const response = await this.client.get<ISearchRawIntlResponseData>(
        `/api/search/${query}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
