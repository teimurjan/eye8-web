import uniq from 'lodash/uniq';
import * as React from 'react';

import {
  IProductTypeListRawIntlMinifiedResponseItem,
  IProductTypeListResponseMeta,
  ProductTypeSortingType,
} from 'src/api/ProductTypeAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

interface IArgs {
  productTypeService: IProductTypeService;
  mandatoryProductTypeId?: number;
}

export const useSelectProductTypes = ({ productTypeService, mandatoryProductTypeId }: IArgs) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const [data, setData] = React.useState<{
    entities: { [id: string]: IProductTypeListRawIntlMinifiedResponseItem };
    order: number[];
  }>({ entities: {}, order: [] });
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
        const { entities, result, meta } = await productTypeService.getAllRawIntlMinified(
          page,
          ProductTypeSortingType.RECENT,
        );
        setData({ entities: { ...data.entities, ...entities.productTypes }, order: uniq([...data.order, ...result]) });
        setMeta(meta);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [productTypeService, data],
  );

  React.useEffect(() => {
    getProductTypes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      if (mandatoryProductTypeId && !data.entities[mandatoryProductTypeId] && meta.page > 0) {
        try {
          setLoading(true);
          const productType = await productTypeService.getOneRawIntl(mandatoryProductTypeId);
          if (productType) {
            setData({
              entities: { ...data.entities, [productType.id]: productType },
              order: [...data.order, productType.id],
            });
          }
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandatoryProductTypeId, meta.page]);

  const loadMore = React.useCallback(() => {
    if (meta.page < meta.pages_count && !isLoading) {
      getProductTypes(meta.page + 1);
    }
  }, [getProductTypes, meta, isLoading]);

  return {
    productTypes: agregateOrderedMapToArray(data.entities, data.order, productType => ({
      ...productType,
      name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
    })),
    isLoading,
    error,
    loadMore,
  };
};
