import { normalize, schema } from 'normalizr';

import {
  IFeatureTypeAPI,
  IFeatureTypeListResponseItem,
  IFeatureTypeListRawIntlResponseItem,
  IFeatureTypeCreatePayload,
  IFeatureTypeEditPayload,
  FeatureTypeNotFoundError,
} from '@eye8/api/feature-type';

export interface IFeatureTypeService {
  getAll(): Promise<{
    entities: {
      featureTypes: {
        [key: string]: IFeatureTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureTypes: {
        [key: string]: IFeatureTypeListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: IFeatureTypeCreatePayload): Promise<IFeatureTypeListRawIntlResponseItem>;
  edit(id: number, payload: IFeatureTypeEditPayload): Promise<IFeatureTypeListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<IFeatureTypeListRawIntlResponseItem | undefined>;
}

export class FeatureTypeNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FeatureTypeService implements IFeatureTypeService {
  private API: IFeatureTypeAPI;
  constructor(API: IFeatureTypeAPI) {
    this.API = API;
  }

  public getAll: IFeatureTypeService['getAll'] = async () => {
    const featureTypes = await this.API.getAll();
    return normalize(featureTypes.data, [new schema.Entity('featureTypes')]);
  };

  public getAllRawIntl: IFeatureTypeService['getAllRawIntl'] = async () => {
    const featureTypes = await this.API.getAllRawIntl();
    return normalize(featureTypes.data, [new schema.Entity('featureTypes')]);
  };

  public delete: IFeatureTypeService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof FeatureTypeNotFoundError) {
        throw new FeatureTypeNotExistsError();
      }

      throw e;
    }
  };

  public create: IFeatureTypeService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IFeatureTypeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof FeatureTypeNotFoundError) {
        throw new FeatureTypeNotExistsError();
      }

      throw e;
    }
  };

  public exists: IFeatureTypeService['exists'] = async (id) => {
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

  public getOneRawIntl: IFeatureTypeService['getOneRawIntl'] = async (id) => {
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
