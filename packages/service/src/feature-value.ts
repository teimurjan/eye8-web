import { normalize, schema } from 'normalizr';

import {
  FeatureValueListResponseItem,
  FeatureValueListRawIntlResponseItem,
  FeatureValueCreatePayload,
  FeatureValueEditPayload,
  FeatureValueAPI,
  FeatureValueNotFound,
} from '@eye8/api/feature-value';

export interface FeatureValueService {
  getAll(): Promise<{
    entities: {
      featureValues: {
        [key: string]: FeatureValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureValues: {
        [key: string]: FeatureValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: FeatureValueCreatePayload): Promise<FeatureValueListRawIntlResponseItem>;
  edit(id: number, payload: FeatureValueEditPayload): Promise<FeatureValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<FeatureValueListRawIntlResponseItem | undefined>;
}

export class FeatureValueNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

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
      if (e instanceof FeatureValueNotFound) {
        throw new FeatureValueNotExistsError();
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
      if (e instanceof FeatureValueNotFound) {
        throw new FeatureValueNotExistsError();
      }

      throw e;
    }
  };

  public exists: FeatureValueService['exists'] = async (id) => {
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

  public getOneRawIntl: FeatureValueService['getOneRawIntl'] = async (id) => {
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
