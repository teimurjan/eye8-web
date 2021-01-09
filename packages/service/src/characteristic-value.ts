import { normalize, schema } from 'normalizr';

import {
  CharacteristicValueAPI,
  CharacteristicValueNotFoundError,
  CharacteristicValueListResponseItem,
  CharacteristicValueListRawIntlResponseItem,
  CharacteristicValueCreatePayload,
  CharacteristicValueEditPayload,
} from '@eye8/api/characteristic-value';

export interface CharacteristicValueService {
  getAll(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: CharacteristicValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: CharacteristicValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: CharacteristicValueCreatePayload): Promise<CharacteristicValueListRawIntlResponseItem>;
  edit(id: number, payload: CharacteristicValueEditPayload): Promise<CharacteristicValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<CharacteristicValueListRawIntlResponseItem | undefined>;
}

export class CharacteristicValueNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements CharacteristicValueService {
  private API: CharacteristicValueAPI;
  constructor(API: CharacteristicValueAPI) {
    this.API = API;
  }

  public getAll: CharacteristicValueService['getAll'] = async () => {
    const characteristicValues = await this.API.getAll();
    return normalize(characteristicValues.data, [new schema.Entity('characteristicValues')]);
  };

  public getAllRawIntl: CharacteristicValueService['getAllRawIntl'] = async () => {
    const characteristicValues = await this.API.getAllRawIntl();
    return normalize(characteristicValues.data, [new schema.Entity('characteristicValues')]);
  };

  public delete: CharacteristicValueService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        throw new CharacteristicValueNotExistsError();
      }

      throw e;
    }
  };

  public create: CharacteristicValueService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: CharacteristicValueService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        throw new CharacteristicValueNotExistsError();
      }

      throw e;
    }
  };

  public exists: CharacteristicValueService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: CharacteristicValueService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
