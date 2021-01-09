import { normalize, schema } from 'normalizr';

import {
  CharacteristicAPI,
  CharacteristicListResponseItem,
  CharacteristicListRawIntlResponseItem,
  CharacteristicCreatePayload,
  CharacteristicEditPayload,
  CharacteristicNotFoundError,
} from '@eye8/api/characteristic';

export interface CharacteristicService {
  getAll(): Promise<{
    entities: {
      characteristics: {
        [key: string]: CharacteristicListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristics: {
        [key: string]: CharacteristicListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: CharacteristicCreatePayload): Promise<CharacteristicListRawIntlResponseItem>;
  edit(id: number, payload: CharacteristicEditPayload): Promise<CharacteristicListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<CharacteristicListRawIntlResponseItem | undefined>;
}

export class CharacteristicNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements CharacteristicService {
  private API: CharacteristicAPI;
  constructor(API: CharacteristicAPI) {
    this.API = API;
  }

  public getAll: CharacteristicService['getAll'] = async () => {
    const characteristics = await this.API.getAll();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public getAllRawIntl: CharacteristicService['getAllRawIntl'] = async () => {
    const characteristics = await this.API.getAllRawIntl();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public delete: CharacteristicService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        throw new CharacteristicNotExistsError();
      }

      throw e;
    }
  };

  public create: CharacteristicService['create'] = async (payload: CharacteristicCreatePayload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: CharacteristicService['edit'] = async (id, payload: CharacteristicEditPayload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        throw new CharacteristicNotExistsError();
      }

      throw e;
    }
  };

  public exists: CharacteristicService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: CharacteristicService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
