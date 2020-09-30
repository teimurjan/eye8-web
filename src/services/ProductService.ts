import { normalize, schema } from 'normalizr';

import * as productAPI from 'src/api/ProductAPI';

export const errors = {
  ProductNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IProductService {
  getAll(
    page: number,
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
    meta: productAPI.IProductListResponseMeta;
  }>;
  getForCart(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: productAPI.IProductCreatePayload): Promise<productAPI.IProductListResponseItem>;
  edit(id: number, payload: productAPI.IProductEditPayload): Promise<productAPI.IProductListResponseItem>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<productAPI.IProductListResponseItem | undefined>;
  getForProductType(
    productTypeID: number,
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
  }>;
  getSome(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
  }>;
}

export class ProductService implements IProductService {
  private API: productAPI.IProductAPI;
  constructor(API: productAPI.IProductAPI) {
    this.API = API;
  }

  public getAll: IProductService['getAll'] = async (page: number) => {
    const products = await this.API.getAll(page);
    return {
      ...normalize(products.data, [new schema.Entity('products')]),
      meta: products.meta,
    };
  };

  public getSome: IProductService['getSome'] = async (ids: number[]) => {
    const products = await this.API.getSome(ids);
    return normalize(products.data, [new schema.Entity('products')]);
  };

  public getForCart: IProductService['getForCart'] = async (ids: number[]) => {
    const products = await this.API.getForCart(ids);
    return normalize(products.data, [new schema.Entity('products')]);
  };

  public delete(id: number) {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        throw new errors.ProductNotExists();
      }

      throw e;
    }
  }

  public create: IProductService['create'] = async (payload: productAPI.IProductCreatePayload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IProductService['edit'] = async (id: number, payload: productAPI.IProductEditPayload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        throw new errors.ProductNotExists();
      }

      throw e;
    }
  };

  public exists: IProductService['exists'] = async (id: number) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOne: IProductService['getOne'] = async (id: number) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        return undefined;
      }

      throw e;
    }
  };

  public getForProductType: IProductService['getForProductType'] = async (productTypeID: number) => {
    const products = await this.API.getForProductType(productTypeID);
    return normalize(products.data, [new schema.Entity('products')]);
  };
}
