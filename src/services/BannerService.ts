import { normalize, schema } from 'normalizr';

import * as bannerAPI from 'src/api/BannerAPI';

export interface IBannerService {
  getAll(): Promise<{
    entities: {
      banners: { [key: string]: bannerAPI.IBannerListResponseItem };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      banners: {
        [key: string]: bannerAPI.IBannerListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: bannerAPI.IBannerCreatePayload): Promise<bannerAPI.IBannerListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<bannerAPI.IBannerListRawIntlResponseItem | undefined>;
  edit(id: number, payload: bannerAPI.IBannerCreatePayload): Promise<bannerAPI.IBannerListRawIntlResponseItem>;
}

export const errors = {
  BannerNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class BannerService implements IBannerService {
  private API: bannerAPI.IBannerAPI;
  constructor(API: bannerAPI.IBannerAPI) {
    this.API = API;
  }

  public getAll: IBannerService['getAll'] = async () => {
    const banners = await this.API.getAll();
    return normalize(banners.data, [new schema.Entity('banners')]);
  };

  public getAllRawIntl: IBannerService['getAllRawIntl'] = async () => {
    const banners = await this.API.getAllRawIntl();
    return normalize(banners.data, [new schema.Entity('banners')]);
  };

  public delete: IBannerService['delete'] = async (id: number) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof bannerAPI.errors.BannerNotFound) {
        throw new errors.BannerNotExists();
      }

      throw e;
    }
  };

  public create: IBannerService['create'] = async (payload: bannerAPI.IBannerCreatePayload) => {
    return (await this.API.create(payload)).data;
  };

  public exists: IBannerService['exists'] = async (id: number) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof bannerAPI.errors.BannerNotFound) {
        return false;
      }

      throw e;
    }
  };

  public edit: IBannerService['edit'] = async (id: number, payload: bannerAPI.IBannerCreatePayload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof bannerAPI.errors.BannerNotFound) {
        throw new errors.BannerNotExists();
      }

      throw e;
    }
  };

  public getOneRawIntl: IBannerService['getOneRawIntl'] = async (id: number) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof bannerAPI.errors.BannerNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
