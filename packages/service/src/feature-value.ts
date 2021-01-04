import { normalize, schema } from 'normalizr';

import {
  IFeatureValueListResponseItem,
  IFeatureValueListRawIntlResponseItem,
  IFeatureValueCreatePayload,
  IFeatureValueEditPayload,
  IFeatureValueAPI,
  FeatureValueNotFound,
} from '@eye8/api/feature-value';

export interface IFeatureValueService {
  getAll(): Promise<{
    entities: {
      featureValues: {
        [key: string]: IFeatureValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureValues: {
        [key: string]: IFeatureValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: IFeatureValueCreatePayload): Promise<IFeatureValueListRawIntlResponseItem>;
  edit(id: number, payload: IFeatureValueEditPayload): Promise<IFeatureValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<IFeatureValueListRawIntlResponseItem | undefined>;
}

export class FeatureValueNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FeatureValueService implements IFeatureValueService {
  private API: IFeatureValueAPI;
  constructor(API: IFeatureValueAPI) {
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
      if (e instanceof FeatureValueNotFound) {
        throw new FeatureValueNotExistsError();
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
      if (e instanceof FeatureValueNotFound) {
        throw new FeatureValueNotExistsError();
      }

      throw e;
    }
  };

  public exists: IFeatureValueService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof FeatureValueNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: IFeatureValueService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof FeatureValueNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
