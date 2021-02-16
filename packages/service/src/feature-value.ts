import { normalize, schema } from 'normalizr';

import {
  FeatureValue,
  FeatureValueAPI,
  FeatureValueCreatePayload,
  FeatureValueEditPayload,
  FeatureValueNotFoundError,
} from '@eye8/api';

export interface FeatureValueService {
  getAll(): Promise<{
    entities: {
      featureValues: {
        [key: string]: FeatureValue;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureValues: {
        [key: string]: FeatureValue<true>;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: FeatureValueCreatePayload): Promise<FeatureValue<true>>;
  edit(id: number, payload: FeatureValueEditPayload): Promise<FeatureValue<true>>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<FeatureValue<true> | undefined>;
}

export { FeatureValueNotFoundError };

export default class implements FeatureValueService {
  private API: FeatureValueAPI;
  constructor(API: FeatureValueAPI) {
    this.API = API;
  }

  public getAll: FeatureValueService['getAll'] = async () => {
    const featureValues = await this.API.getAll();
    return normalize(featureValues.data, [new schema.Entity('featureValues')]);
  };

  public getAllRawIntl: FeatureValueService['getAllRawIntl'] = async () => {
    const featureValues = await this.API.getAllRawIntl();
    return normalize(featureValues.data, [new schema.Entity('featureValues')]);
  };

  public delete: FeatureValueService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof FeatureValueNotFoundError) {
        throw new FeatureValueNotFoundError();
      }

      throw e;
    }
  };

  public create: FeatureValueService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: FeatureValueService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof FeatureValueNotFoundError) {
        throw new FeatureValueNotFoundError();
      }

      throw e;
    }
  };

  public exists: FeatureValueService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof FeatureValueNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: FeatureValueService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof FeatureValueNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
