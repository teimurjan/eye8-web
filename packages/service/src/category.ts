import { normalize, schema } from 'normalizr';

import {
  CategoryNotFoundError,
  CategoryWithChildrenNotDeletedError,
  CategoryWithProductTypesNotDeletedError,
  ICategoryListResponseItem,
  ICategoryListRawIntlResponseItem,
  ICategoryCreatePayload,
  ICategoryAPI,
} from '@eye8/api/category';

export interface ICategoryService {
  getAll(): Promise<{
    entities: {
      categories: { [key: string]: ICategoryListResponseItem };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      categories: {
        [key: string]: ICategoryListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: ICategoryCreatePayload): Promise<ICategoryListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<ICategoryListRawIntlResponseItem | undefined>;
  getOne(id: number): Promise<ICategoryListResponseItem | undefined>;
  getOneBySlug(slug: string): Promise<ICategoryListResponseItem | undefined>;
  edit(id: number, payload: ICategoryCreatePayload): Promise<ICategoryListRawIntlResponseItem>;
}

export class CategoryNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class CategoryHasChildrenError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class CategoryHasProductTypesError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CategoryService implements ICategoryService {
  private API: ICategoryAPI;
  constructor(API: ICategoryAPI) {
    this.API = API;
  }

  public getAll: ICategoryService['getAll'] = async () => {
    const categories = await this.API.getAll();
    return normalize(categories.data, [new schema.Entity('categories')]);
  };

  public getAllRawIntl: ICategoryService['getAllRawIntl'] = async () => {
    const categories = await this.API.getAllRawIntl();
    return normalize(categories.data, [new schema.Entity('categories')]);
  };

  public delete: ICategoryService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new CategoryNotExistsError();
      }
      if (e instanceof CategoryWithChildrenNotDeletedError) {
        throw new CategoryHasChildrenError();
      }
      if (e instanceof CategoryWithProductTypesNotDeletedError) {
        throw new CategoryHasProductTypesError();
      }

      throw e;
    }
  };

  public create: ICategoryService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public exists: ICategoryService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public edit: ICategoryService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new CategoryNotExistsError();
      }

      throw e;
    }
  };

  public getOneRawIntl: ICategoryService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };

  public getOne: ICategoryService['getOne'] = async (id) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };

  public getOneBySlug: ICategoryService['getOneBySlug'] = async (slug) => {
    try {
      return (await this.API.getOneBySlug(slug)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
