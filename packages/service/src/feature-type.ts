import { normalize, schema } from 'normalizr';

import {
  FeatureTypeAPI,
  FeatureTypeListResponseItem,
  FeatureTypeListRawIntlResponseItem,
  FeatureTypeCreatePayload,
  FeatureTypeEditPayload,
  FeatureTypeNotFoundError,
} from '@eye8/api/feature-type';

export interface FeatureTypeService {
  getAll(): Promise<{
    entities: {
      featureTypes: {
        [key: string]: FeatureTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureTypes: {
        [key: string]: FeatureTypeListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: FeatureTypeCreatePayload): Promise<FeatureTypeListRawIntlResponseItem>;
  edit(id: number, payload: FeatureTypeEditPayload): Promise<FeatureTypeListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<FeatureTypeListRawIntlResponseItem | undefined>;
}

export class FeatureTypeNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements FeatureTypeService {
  private API: FeatureTypeAPI;
  constructor(API: FeatureTypeAPI) {
    this.API = API;
  }

  public getAll: FeatureTypeService['getAll'] = async () => {
    const featureTypes = await this.API.getAll();
    return normalize(featureTypes.data, [new schema.Entity('featureTypes')]);
  };

  public getAllRawIntl: FeatureTypeService['getAllRawIntl'] = async () => {
    const featureTypes = await this.API.getAllRawIntl();
    return normalize(featureTypes.data, [new schema.Entity('featureTypes')]);
  };

  public delete: FeatureTypeService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof FeatureTypeNotFoundError) {
        throw new FeatureTypeNotExistsError();
      }

      throw e;
    }
  };

  public create: FeatureTypeService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: FeatureTypeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof FeatureTypeNotFoundError) {
        throw new FeatureTypeNotExistsError();
      }

      throw e;
    }
  };

  public exists: FeatureTypeService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof FeatureTypeNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: FeatureTypeService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof FeatureTypeNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
