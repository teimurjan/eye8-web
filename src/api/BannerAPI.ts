import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/queryString';

export interface IBannerListResponseItem {
  id: number;
  text: string;
  link_text: string;
  link: string | null;
  text_color: string | null;
  image: string;
  text_top_offset: number | null;
  text_left_offset: number | null;
  text_right_offset: number | null;
  text_bottom_offset: number | null;
  created_on: string;
  updated_on: string;
}

export interface IBannerListRawIntlResponseItem {
  id: number;
  text: {
    [key: string]: string;
  };
  link_text: {
    [key: string]: string;
  };
  link: string | null;
  text_color: string | null;
  image: string;
  text_top_offset: number | null;
  text_left_offset: number | null;
  text_right_offset: number | null;
  text_bottom_offset: number | null;
  created_on: string;
  updated_on: string;
}

export interface IBannerListResponseData {
  data: IBannerListResponseItem[];
}

export interface IBannerListRawIntlResponseData {
  data: IBannerListRawIntlResponseItem[];
}

export interface IBannerRawIntlResponseData {
  data: IBannerListRawIntlResponseItem;
}

export interface IBannerCreatePayload {
  texts: {
    [key: string]: string;
  };
  link_texts: {
    [key: string]: string;
  };
  link: string | null;
  text_color: string | null;
  image: string;
  text_top_offset: number | null;
  text_left_offset: number | null;
  text_right_offset: number | null;
  text_bottom_offset: number | null;
}

export interface IBannerAPI {
  getAll(): Promise<IBannerListResponseData>;
  getAllRawIntl(): Promise<IBannerListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IBannerCreatePayload): Promise<IBannerRawIntlResponseData>;
  edit(id: number, payload: IBannerCreatePayload): Promise<IBannerRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<IBannerRawIntlResponseData>;
}

export const errors = {
  BannerNotFound: class extends Error {
    constructor() {
      super('Banner not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class BannerAPI implements IBannerAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: IBannerAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<IBannerListResponseData>('/api/banners', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: IBannerAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<IBannerListRawIntlResponseData>(
        `/api/banners${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: IBannerAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/banners/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.BannerNotFound();
      }

      throw e;
    }
  };

  public status: IBannerAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/banners/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.BannerNotFound();
      }
      throw e;
    }
  };

  public create: IBannerAPI['create'] = async ({ image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<IBannerRawIntlResponseData>(`/api/banners`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: IBannerAPI['edit'] = async (id: number, { image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.put<IBannerRawIntlResponseData>(
        `/api/banners/${id}${buildSearchString({ raw_intl: 1 })}`,
        formData,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.BannerNotFound();
      }
      throw e;
    }
  };

  public getOneRawIntl: IBannerAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<IBannerRawIntlResponseData>(
        `/api/banners/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.BannerNotFound();
      }
      throw e;
    }
  };
}
