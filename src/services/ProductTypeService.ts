import { normalize, schema } from 'normalizr';

import * as productTypeAPI from 'src/api/ProductTypeAPI';

export const errors = {
  ProductTypeNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  ProductTypeHasProducts: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IProductTypeService {
  getForCategory(
    categorySlug: string,
    page: number,
    sortBy?: productTypeAPI.ProductTypeSortingType,
    available?: boolean,
  ): Promise<{
    entities: {
      productTypes?: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  getAll(
    page: number,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getNewest(): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getByID(id: number): Promise<productTypeAPI.IProductTypeDetailResponseItem | null>;
  getBySlug(slug: string): Promise<productTypeAPI.IProductTypeDetailResponseItem | null>;
  getAllRawIntl(
    page: number,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  getAllRawIntlMinified(
    page?: number,
    sortBy?: productTypeAPI.ProductTypeSortingType,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListRawIntlMinifiedResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  delete(id: number): Promise<void>;
  create(
    payload: productTypeAPI.IProductTypeCreatePayload,
  ): Promise<productTypeAPI.IProductTypeDetailRawIntlResponseItem>;
  edit(
    id: number,
    payload: productTypeAPI.IProductTypeEditPayload,
  ): Promise<productTypeAPI.IProductTypeDetailRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<productTypeAPI.IProductTypeDetailRawIntlResponseItem | undefined>;
}

export class ProductTypeService implements IProductTypeService {
  private API: productTypeAPI.IProductTypeAPI;
  constructor(API: productTypeAPI.IProductTypeAPI) {
    this.API = API;
  }

  public getForCategory: IProductTypeService['getForCategory'] = async (categorySlug, page, sortBy, available) => {
    const productTypes = await this.API.getForCategory(categorySlug, page, sortBy, available);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAll: IProductTypeService['getAll'] = async (page) => {
    const productTypes = await this.API.getAll(page);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAllRawIntlMinified: IProductTypeService['getAllRawIntlMinified'] = async (page, sortBy) => {
    const productTypes = await this.API.getAllRawIntlMinified(page, sortBy);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getNewest: IProductTypeService['getNewest'] = async () => {
    const productTypes = await this.API.getNewest();
    return normalize(productTypes.data, [new schema.Entity('productTypes')]);
  };

  public getByID: IProductTypeService['getByID'] = async (id) => {
    try {
      return (await this.API.getByID(id)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return null;
      }

      throw e;
    }
  };

  public getBySlug: IProductTypeService['getBySlug'] = async (slug) => {
    try {
      return (await this.API.getBySlug(slug)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return null;
      }

      throw e;
    }
  };

  public getAllRawIntl: IProductTypeService['getAllRawIntl'] = async (page) => {
    const productTypes = await this.API.getAllRawIntl(page);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public delete: IProductTypeService['delete'] = async (id) => {
    try {
      await this.API.delete(id);
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        throw new errors.ProductTypeNotExists();
      }
      if (e instanceof productTypeAPI.errors.ProductTypeWithProductsIsUntouchable) {
        throw new errors.ProductTypeHasProducts();
      }

      throw e;
    }
  };

  public create: IProductTypeService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IProductTypeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        throw new errors.ProductTypeNotExists();
      }

      throw e;
    }
  };

  public exists: IProductTypeService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: IProductTypeService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
