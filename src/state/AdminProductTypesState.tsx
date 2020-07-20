import * as React from 'react';

import { IIntlListResponseItem } from 'src/api/IntlAPI';
import { IProductTypeListRawIntlResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { useDependencies } from 'src/DI/DI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

const defaultMeta = { count: undefined, pages_count: undefined, page: undefined, limit: undefined };

export interface IContextValue {
  adminProductTypesState: {
    productTypes: IProductTypeListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getProductTypes: (page?: number) => Promise<void>;
    deleteProductType: (id: number) => void;
    addProductType: (productType: IProductTypeListRawIntlResponseItem) => void;
    setProductType: (productType: IProductTypeListRawIntlResponseItem) => void;
    meta: IProductTypeListResponseMeta | typeof defaultMeta;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const agregateProductTypesForState = (
  productTypes: { [key: string]: IProductTypeListRawIntlResponseItem },
  productTypesOrder: number[],
  availableLocales: IIntlListResponseItem[],
) =>
  agregateOrderedMapToArray(productTypes, productTypesOrder, productType => ({
    ...productType,
    name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
    description: extendIntlTextWithLocaleNames(productType.description, availableLocales),
    short_description: extendIntlTextWithLocaleNames(productType.short_description, availableLocales),
  }));

export const AdminProductTypesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const {
    dependencies: {
      services: { productType: service },
    },
  } = useDependencies();

  const [meta, setMeta] = React.useState<IProductTypeListResponseMeta | typeof defaultMeta>(defaultMeta);
  const [productTypes, setProductTypes] = React.useState<{ [key: string]: IProductTypeListRawIntlResponseItem }>({});
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getProductTypes = React.useCallback(
    async (page = 1) => {
      setListLoading(true);
      try {
        const { entities, result, meta } = await service.getAllRawIntl(page);
        setProductTypes(entities.productTypes);
        setProductTypesOrder(result);
        setMeta(meta);
      } catch (e) {
        setListError('errors.common');
      } finally {
        setListLoading(false);
        setListLoaded(true);
      }
    },
    [service],
  );

  const addProductType = React.useCallback(
    (productType: IProductTypeListRawIntlResponseItem) => {
      const newProductTypes = {
        ...productTypes,
        [productType.id]: productType,
      };

      const newProductTypesOrder = [...productTypesOrder, productType.id];

      setProductTypes(newProductTypes);
      setProductTypesOrder(newProductTypesOrder);
    },
    [productTypes, productTypesOrder],
  );

  const setProductType = React.useCallback(
    (productType: IProductTypeListRawIntlResponseItem) => {
      const newProductTypes = {
        ...productTypes,
        [productType.id]: productType,
      };

      setProductTypes(newProductTypes);
    },
    [productTypes],
  );

  const deleteProductType = React.useCallback(
    (id: number) => {
      const newProductTypes = { ...productTypes };
      delete newProductTypes[id];

      const newProductTypesOrder = productTypesOrder.filter(idFromOrder => idFromOrder !== id);
      setProductTypesOrder(newProductTypesOrder);
      setProductTypes(newProductTypes);
    },
    [productTypes, productTypesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminProductTypesState: {
          meta,
          addProductType,
          deleteProductType,
          productTypes: agregateProductTypesForState(productTypes, productTypesOrder, availableLocales),
          getProductTypes,
          hasListLoaded,
          isListLoading,
          listError,
          setProductType,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminProductTypesState = () => React.useContext(Context) as IContextValue;
