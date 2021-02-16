import { normalize, schema } from 'normalizr';

import {
  Product,
  PaginationMeta,
  ProductAPI,
  ProductNotFoundError,
  ProductGetAllOptions,
  ProductDeleteOptions,
  ProductCreatePayload,
  ProductEditPayload,
  ProductGetOneOptions,
  ProductGetForProductTypeOptions,
} from '@eye8/api';

export { ProductNotFoundError };

export interface ProductService {
  getAll(
    options: ProductGetAllOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: Product;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  getForCart(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: Product;
      };
    };
    result: number[];
  }>;
  delete(id: number, options?: ProductDeleteOptions): Promise<{}>;
  create(payload: ProductCreatePayload): Promise<Product>;
  edit(id: number, payload: ProductEditPayload): Promise<Product>;
  exists(id: number, options?: ProductGetOneOptions): Promise<boolean>;
  getOne(id: number, options?: ProductGetOneOptions): Promise<Product | undefined>;
  getForProductType(
    productTypeID: number,
    options?: ProductGetForProductTypeOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: Product;
      };
    };
    result: number[];
  }>;
  getSome(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: Product;
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
        throw new ProductNotFoundError();
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
        throw new ProductNotFoundError();
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
