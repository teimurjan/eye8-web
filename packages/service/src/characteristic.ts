import { normalize, schema } from 'normalizr';

import {
  ICharacteristicAPI,
  ICharacteristicListResponseItem,
  ICharacteristicListRawIntlResponseItem,
  ICharacteristicCreatePayload,
  ICharacteristicEditPayload,
  CharacteristicNotFoundError,
} from '@eye8/api/characteristic';

export interface ICharacteristicService {
  getAll(): Promise<{
    entities: {
      characteristics: {
        [key: string]: ICharacteristicListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristics: {
        [key: string]: ICharacteristicListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: ICharacteristicCreatePayload): Promise<ICharacteristicListRawIntlResponseItem>;
  edit(id: number, payload: ICharacteristicEditPayload): Promise<ICharacteristicListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<ICharacteristicListRawIntlResponseItem | undefined>;
}

export class CharacteristicNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CharacteristicService implements ICharacteristicService {
  private API: ICharacteristicAPI;
  constructor(API: ICharacteristicAPI) {
    this.API = API;
  }

  public getAll: ICharacteristicService['getAll'] = async () => {
    const characteristics = await this.API.getAll();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public getAllRawIntl: ICharacteristicService['getAllRawIntl'] = async () => {
    const characteristics = await this.API.getAllRawIntl();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public delete: ICharacteristicService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        throw new CharacteristicNotExistsError();
      }

      throw e;
    }
  };

  public create: ICharacteristicService['create'] = async (payload: ICharacteristicCreatePayload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: ICharacteristicService['edit'] = async (id, payload: ICharacteristicEditPayload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        throw new CharacteristicNotExistsError();
      }

      throw e;
    }
  };

  public exists: ICharacteristicService['exists'] = async (id) => {
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

  public getOneRawIntl: ICharacteristicService['getOneRawIntl'] = async (id) => {
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
