import { normalize, schema } from 'normalizr';

import * as categoryAPI from 'src/api/CategoryAPI';

export interface ICategoryService {
  getAll(): Promise<{
    entities: {
      categories: { [key: string]: categoryAPI.ICategoryListResponseItem };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      categories: {
        [key: string]: categoryAPI.ICategoryListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: categoryAPI.ICategoryCreatePayload): Promise<categoryAPI.ICategoryListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<categoryAPI.ICategoryListRawIntlResponseItem | undefined>;
  getOne(id: number): Promise<categoryAPI.ICategoryListResponseItem | undefined>;
  getOneBySlug(slug: string): Promise<categoryAPI.ICategoryListResponseItem | undefined>;
  edit(id: number, payload: categoryAPI.ICategoryCreatePayload): Promise<categoryAPI.ICategoryListRawIntlResponseItem>;
}

export const errors = {
  CategoryNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  CategoryHasChildren: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  CategoryHasProductTypes: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class CategoryService implements ICategoryService {
  private API: categoryAPI.ICategoryAPI;
  constructor(API: categoryAPI.ICategoryAPI) {
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
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        throw new errors.CategoryNotExists();
      }
      if (e instanceof categoryAPI.errors.CategoryWithChildrenIsUntouchable) {
        throw new errors.CategoryHasChildren();
      }
      if (e instanceof categoryAPI.errors.CategoryWithProductTypesIsUntouchable) {
        throw new errors.CategoryHasProductTypes();
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
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        return false;
      }

      throw e;
    }
  };

  public edit: ICategoryService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        throw new errors.CategoryNotExists();
      }

      throw e;
    }
  };

  public getOneRawIntl: ICategoryService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        return undefined;
      }

      throw e;
    }
  };

  public getOne: ICategoryService['getOne'] = async (id) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        return undefined;
      }

      throw e;
    }
  };

  public getOneBySlug: ICategoryService['getOneBySlug'] = async (slug) => {
    try {
      return (await this.API.getOneBySlug(slug)).data;
    } catch (e) {
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
