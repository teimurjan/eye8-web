import { normalize, schema } from 'normalizr';

import {
  IBannerAPI,
  BannerNotFoundError,
  IBannerListResponseItem,
  IBannerListRawIntlResponseItem,
  IBannerCreatePayload,
} from '@eye8/api/banner';

export interface IBannerService {
  getAll(): Promise<{
    entities: {
      banners: { [key: string]: IBannerListResponseItem };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      banners: {
        [key: string]: IBannerListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: IBannerCreatePayload): Promise<IBannerListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<IBannerListRawIntlResponseItem | undefined>;
  edit(id: number, payload: IBannerCreatePayload): Promise<IBannerListRawIntlResponseItem>;
}

class BannerNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BannerService implements IBannerService {
  private API: IBannerAPI;
  constructor(API: IBannerAPI) {
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

  public delete: IBannerService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        throw new BannerNotExistsError();
      }

      throw e;
    }
  };

  public create: IBannerService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public exists: IBannerService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public edit: IBannerService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof BannerNotFoundError) {
        throw new BannerNotExistsError();
      }

      throw e;
    }
  };

  public getOneRawIntl: IBannerService['getOneRawIntl'] = async (id: number) => {
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
