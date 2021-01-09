import { normalize, schema } from 'normalizr';

import {
  ProductAPI,
  GetAllOptions,
  ProductListResponseItem,
  ProductListResponseMeta,
  DeleteOptions,
  ProductCreatePayload,
  ProductEditPayload,
  GetOneOptions,
  GetForProductTypeOptions,
  ProductNotFoundError,
} from '@eye8/api/product';

class ProductNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ProductService {
  getAll(
    options: GetAllOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: ProductListResponseItem;
      };
    };
    result: number[];
    meta: ProductListResponseMeta;
  }>;
  getForCart(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: ProductListResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number, options?: DeleteOptions): Promise<{}>;
  create(payload: ProductCreatePayload): Promise<ProductListResponseItem>;
  edit(id: number, payload: ProductEditPayload): Promise<ProductListResponseItem>;
  exists(id: number, options?: GetOneOptions): Promise<boolean>;
  getOne(id: number, options?: GetOneOptions): Promise<ProductListResponseItem | undefined>;
  getForProductType(
    productTypeID: number,
    options?: GetForProductTypeOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: ProductListResponseItem;
      };
    };
    result: number[];
  }>;
  getSome(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: ProductListResponseItem;
      };
    };
    result: number[];
  }>;
}

export default class implements ProductService {
  private API: ProductAPI;
  constructor(API: ProductAPI) {
    this.API = API;
  }

  public getAll: ProductService['getAll'] = async (options) => {
    const products = await this.API.getAll(options);
    return {
      ...normalize(products.data, [new schema.Entity('products')]),
      meta: products.meta,
    };
  };

  public getSome: ProductService['getSome'] = async (ids) => {
    const products = await this.API.getSome(ids);
    return normalize(products.data, [new schema.Entity('products')]);
  };

  public getForCart: ProductService['getForCart'] = async (ids) => {
    const products = await this.API.getForCart(ids);
    return normalize(products.data, [new schema.Entity('products')]);
  };

  public delete: ProductService['delete'] = async (id, options = {}) => {
    try {
      return this.API.delete(id, options);
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        throw new ProductNotExistsError();
      }

      throw e;
    }
  };

  public create: ProductService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: ProductService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        throw new ProductNotExistsError();
      }

      throw e;
    }
  };

  public exists: ProductService['exists'] = async (id, options = {}) => {
    try {
      await this.API.status(id, options);
      return true;
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOne: ProductService['getOne'] = async (id, options = {}) => {
    try {
      return (await this.API.getOne(id, options)).data;
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };

  public getForProductType: ProductService['getForProductType'] = async (productTypeID, options = {}) => {
    const products = await this.API.getForProductType(productTypeID, options);
    return normalize(products.data, [new schema.Entity('products')]);
  };
}
