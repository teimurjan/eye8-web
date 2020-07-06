import * as React from 'react';

import { IProductTypeListRawIntlMinifiedResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

interface IArgs {
  productTypeService: IProductTypeService;
}

export const useSelectProductTypes = ({ productTypeService }: IArgs) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const [productTypes, setProductTypes] = React.useState<{ [id: string]: IProductTypeListRawIntlMinifiedResponseItem }>(
    {},
  );
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [meta, setMeta] = React.useState<IProductTypeListResponseMeta>({
    count: 0,
    pages_count: 0,
    page: 0,
    limit: 0,
  });

  const getProductTypes = React.useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const { entities, result, meta } = await productTypeService.getAllRawIntlMinified(page);
        setProductTypes({ ...productTypes, ...entities.productTypes });
        setProductTypesOrder([...productTypesOrder, ...result]);
        setMeta(meta);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [productTypeService, productTypes, productTypesOrder],
  );

  React.useEffect(() => {
    getProductTypes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = React.useCallback(() => {
    if (meta.page < meta.pages_count && !isLoading) {
      getProductTypes(meta.page + 1);
    }
  }, [getProductTypes, meta, isLoading]);

  return {
    productTypes: agregateOrderedMapToArray(productTypes, productTypesOrder, productType => ({
      ...productType,
      name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
    })),
    isLoading,
    error,
    loadMore,
  };
};
