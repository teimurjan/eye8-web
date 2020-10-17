import { normalize, schema } from 'normalizr';

import * as featureTypeAPI from 'src/api/FeatureTypeAPI';

export interface IFeatureTypeService {
  getAll(): Promise<{
    entities: {
      featureTypes: {
        [key: string]: featureTypeAPI.IFeatureTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureTypes: {
        [key: string]: featureTypeAPI.IFeatureTypeListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: featureTypeAPI.IFeatureTypeCreatePayload,
  ): Promise<featureTypeAPI.IFeatureTypeListRawIntlResponseItem>;
  edit(
    id: number,
    payload: featureTypeAPI.IFeatureTypeEditPayload,
  ): Promise<featureTypeAPI.IFeatureTypeListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<featureTypeAPI.IFeatureTypeListRawIntlResponseItem | undefined>;
}

export const errors = {
  FeatureTypeNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class FeatureTypeService implements IFeatureTypeService {
  private API: featureTypeAPI.IFeatureTypeAPI;
  constructor(API: featureTypeAPI.IFeatureTypeAPI) {
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
      if (e instanceof featureTypeAPI.errors.FeatureTypeNotFound) {
        throw new errors.FeatureTypeNotExists();
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
      if (e instanceof featureTypeAPI.errors.FeatureTypeNotFound) {
        throw new errors.FeatureTypeNotExists();
      }

      throw e;
    }
  };

  public exists: IFeatureTypeService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof featureTypeAPI.errors.FeatureTypeNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: IFeatureTypeService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof featureTypeAPI.errors.FeatureTypeNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
