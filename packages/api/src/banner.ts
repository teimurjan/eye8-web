import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { Banner, APIClient } from './types';

export interface CreatePayload {
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

interface BannerAPI {
  getAll(): Promise<{ data: Banner[] }>;
  getAllRawIntl(): Promise<{ data: Banner<true>[] }>;
  delete(id: number): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: Banner<true> }>;
  edit(id: number, payload: CreatePayload): Promise<{ data: Banner<true> }>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<{ data: Banner<true> }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Banner not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements BannerAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: BannerAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<{ data: Banner[] }>('/api/banners', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: BannerAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<{ data: Banner<true>[] }>(
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

  public delete: BannerAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/banners/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }

      throw e;
    }
  };

  public status: BannerAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/banners/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public create: BannerAPI['create'] = async ({ image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<{ data: Banner<true> }>(`/api/banners`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: BannerAPI['edit'] = async (id: number, { image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.put<{ data: Banner<true> }>(
        `/api/banners/${id}${buildSearchString({ raw_intl: 1 })}`,
        formData,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: BannerAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<{ data: Banner<true> }>(
        `/api/banners/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };
}
