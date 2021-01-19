import { APIClient } from '@eye8/api/client';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface BannerListResponseItem {
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

export interface BannerListRawIntlResponseItem {
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

export interface BannerListResponseData {
  data: BannerListResponseItem[];
}

export interface BannerListRawIntlResponseData {
  data: BannerListRawIntlResponseItem[];
}

export interface BannerRawIntlResponseData {
  data: BannerListRawIntlResponseItem;
}

export interface BannerCreatePayload {
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

export interface BannerAPI {
  getAll(): Promise<BannerListResponseData>;
  getAllRawIntl(): Promise<BannerListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: BannerCreatePayload): Promise<BannerRawIntlResponseData>;
  edit(id: number, payload: BannerCreatePayload): Promise<BannerRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<BannerRawIntlResponseData>;
}

export class BannerNotFoundError extends Error {
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
      const response = await this.client.get<BannerListResponseData>('/api/banners', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: BannerAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<BannerListRawIntlResponseData>(
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
        throw new BannerNotFoundError();
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
        throw new BannerNotFoundError();
      }
      throw e;
    }
  };

  public create: BannerAPI['create'] = async ({ image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<BannerRawIntlResponseData>(`/api/banners`, formData, {
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
      const response = await this.client.put<BannerRawIntlResponseData>(
        `/api/banners/${id}${buildSearchString({ raw_intl: 1 })}`,
        formData,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new BannerNotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: BannerAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<BannerRawIntlResponseData>(
        `/api/banners/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new BannerNotFoundError();
      }
      throw e;
    }
  };
}
