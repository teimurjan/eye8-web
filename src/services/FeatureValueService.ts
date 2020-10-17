import { normalize, schema } from 'normalizr';

import * as featureValueAPI from 'src/api/FeatureValueAPI';

export interface IFeatureValueService {
  getAll(): Promise<{
    entities: {
      featureValues: {
        [key: string]: featureValueAPI.IFeatureValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureValues: {
        [key: string]: featureValueAPI.IFeatureValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: featureValueAPI.IFeatureValueCreatePayload,
  ): Promise<featureValueAPI.IFeatureValueListRawIntlResponseItem>;
  edit(
    id: number,
    payload: featureValueAPI.IFeatureValueEditPayload,
  ): Promise<featureValueAPI.IFeatureValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<featureValueAPI.IFeatureValueListRawIntlResponseItem | undefined>;
}

export const errors = {
  FeatureValueNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class FeatureValueService implements IFeatureValueService {
  private API: featureValueAPI.IFeatureValueAPI;
  constructor(API: featureValueAPI.IFeatureValueAPI) {
    this.API = API;
  }

  public getAll: IFeatureValueService['getAll'] = async () => {
    const featureValues = await this.API.getAll();
    return normalize(featureValues.data, [new schema.Entity('featureValues')]);
  };

  public getAllRawIntl: IFeatureValueService['getAllRawIntl'] = async () => {
    const featureValues = await this.API.getAllRawIntl();
    return normalize(featureValues.data, [new schema.Entity('featureValues')]);
  };

  public delete: IFeatureValueService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        throw new errors.FeatureValueNotExists();
      }

      throw e;
    }
  };

  public create: IFeatureValueService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IFeatureValueService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        throw new errors.FeatureValueNotExists();
      }

      throw e;
    }
  };

  public exists: IFeatureValueService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: IFeatureValueService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
