import { normalize, schema } from 'normalizr';

import { BannerCreatePayload, BannerNotFoundError, Banner, BannerAPI } from '@eye8/api';

export interface BannerService {
  getAll(): Promise<{
    entities: {
      banners: { [key: string]: Banner };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      banners: {
        [key: string]: Banner<true>;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: BannerCreatePayload): Promise<Banner<true>>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<Banner<true> | undefined>;
  edit(id: number, payload: BannerCreatePayload): Promise<Banner<true>>;
}

export { BannerNotFoundError };

export default class implements BannerService {
  private API: BannerAPI;
  constructor(API: BannerAPI) {
    this.API = API;
  }

  public getAll: BannerService['getAll'] = async () => {
    const banners = await this.API.getAll();
    return normalize(banners.data, [new schema.Entity('banners')]);
  };

  public getAllRawIntl: BannerService['getAllRawIntl'] = async () => {
    const banners = await this.API.getAllRawIntl();
    return normalize(banners.data, [new schema.Entity('banners')]);
  };

  public delete: BannerService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        throw new BannerNotFoundError();
      }

      throw e;
    }
  };

  public create: BannerService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public exists: BannerService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        throw new BannerNotFoundError();
      }

      throw e;
    }
  };

  public edit: BannerService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        throw new BannerNotFoundError();
      }

      throw e;
    }
  };

  public getOneRawIntl: BannerService['getOneRawIntl'] = async (id: number) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
