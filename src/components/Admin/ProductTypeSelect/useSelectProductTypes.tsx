import * as React from 'react';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
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

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { entities, result } = await productTypeService.getAllRawIntlMinified();
        setProductTypes(entities.productTypes);
        setProductTypesOrder(result);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    productTypes: agregateOrderedMapToArray(productTypes, productTypesOrder, productType => ({
      ...productType,
      name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
    })),
    isLoading,
    error,
  };
};
