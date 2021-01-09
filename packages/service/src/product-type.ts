import { normalize, schema } from 'normalizr';

import {
  ProductTypeAPI,
  GetForCategoryOptions,
  ProductTypeListResponseItem,
  GetAllOptions,
  SearchOptions,
  ProductTypeListResponseMeta,
  ProductTypeListRawIntlResponseItem,
  GetOneOptions,
  ProductTypeDetailResponseItem,
  GetAllRawIntlMinifiedOptions,
  DeleteOptions,
  ProductTypeCreatePayload,
  ProductTypeDetailRawIntlResponseItem,
  ProductTypeEditPayload,
  ProductTypeListRawIntlMinifiedResponseItem,
  ProductTypeNotFoundError,
  ProductTypeWithProductsNotDeletedError,
} from '@eye8/api/product-type';

export class ProductTypeNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ProductTypeHasProductsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ProductTypeService {
  getForCategory(
    categorySlug: string,
    options: GetForCategoryOptions,
  ): Promise<{
    entities: {
      productTypes?: {
        [key: string]: ProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: ProductTypeListResponseMeta;
  }>;
  getAll(
    options: GetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  search(
    query: string,
    options?: SearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: ProductTypeListResponseMeta;
  }>;
  searchRawIntl(
    query: string,
    options?: SearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: ProductTypeListResponseMeta;
  }>;
  getNewest(): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getByID(id: number, options?: GetOneOptions): Promise<ProductTypeDetailResponseItem | null>;
  getBySlug(slug: string): Promise<ProductTypeDetailResponseItem | null>;
  getAllRawIntl(
    options: GetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: ProductTypeListResponseMeta;
  }>;
  getAllRawIntlMinified(
    options: GetAllRawIntlMinifiedOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductTypeListRawIntlMinifiedResponseItem;
      };
    };
    result: number[];
    meta: ProductTypeListResponseMeta;
  }>;
  delete(id: number, options?: DeleteOptions): Promise<void>;
  create(payload: ProductTypeCreatePayload): Promise<ProductTypeDetailRawIntlResponseItem>;
  edit(id: number, payload: ProductTypeEditPayload): Promise<ProductTypeDetailRawIntlResponseItem>;
  exists(id: number, options?: GetOneOptions): Promise<boolean>;
  getOneRawIntl(id: number, options?: GetOneOptions): Promise<ProductTypeDetailRawIntlResponseItem | undefined>;
}

export default class implements ProductTypeService {
  private API: ProductTypeAPI;
  constructor(API: ProductTypeAPI) {
    this.API = API;
  }

  public getForCategory: ProductTypeService['getForCategory'] = async (
    categorySlug,
    { page, sortingType, characteristicValuesIds, available },
  ) => {
    const productTypes = await this.API.getForCategory(categorySlug, {
      page,
      sortingType,
      characteristicValuesIds,
      available,
    });
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAll: ProductTypeService['getAll'] = async (options) => {
    const productTypes = await this.API.getAll(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public search: ProductTypeService['search'] = async (query, options = {}) => {
    const productTypes = await this.API.search(query, options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public searchRawIntl: ProductTypeService['searchRawIntl'] = async (query, options = {}) => {
    const productTypes = await this.API.searchRawIntl(query, options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAllRawIntlMinified: ProductTypeService['getAllRawIntlMinified'] = async (options) => {
    const productTypes = await this.API.getAllRawIntlMinified(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getNewest: ProductTypeService['getNewest'] = async () => {
    const productTypes = await this.API.getNewest();
    return normalize(productTypes.data, [new schema.Entity('productTypes')]);
  };

  public getByID: ProductTypeService['getByID'] = async (id, options = {}) => {
    try {
      return (await this.API.getByID(id, options)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return null;
      }

      throw e;
    }
  };

  public getBySlug: ProductTypeService['getBySlug'] = async (slug) => {
    try {
      return (await this.API.getBySlug(slug)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return null;
      }

      throw e;
    }
  };

  public getAllRawIntl: ProductTypeService['getAllRawIntl'] = async (options) => {
    const productTypes = await this.API.getAllRawIntl(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public delete: ProductTypeService['delete'] = async (id, options = {}) => {
    try {
      await this.API.delete(id, options);
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        throw new ProductTypeNotExistsError();
      }
      if (e instanceof ProductTypeWithProductsNotDeletedError) {
        throw new ProductTypeHasProductsError();
      }

      throw e;
    }
  };

  public create: ProductTypeService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: ProductTypeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        throw new ProductTypeNotExistsError();
      }

      throw e;
    }
  };

  public exists: ProductTypeService['exists'] = async (id, options = {}) => {
    try {
      await this.API.status(id, options);
      return true;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: ProductTypeService['getOneRawIntl'] = async (id, options = {}) => {
    try {
      return (await this.API.getOneRawIntl(id, options)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
