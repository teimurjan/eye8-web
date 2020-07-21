import * as React from 'react';

import { IProductTypeListRawIntlResponseItem } from 'src/api/ProductTypeAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { useDebounce } from 'src/hooks/useDebounce';
import { ISearchService } from 'src/services/SearchService';
import { ContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  searchService: ISearchService;
  adminProductTypesState: AdminProductTypesStateContextValue['state'];
}

export interface IViewProps {
  productTypes: AdminProductTypesStateContextValue['state']['entities'];
  meta: AdminProductTypesStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
  onPageChange: (page: number) => void;
  search: (query: string) => Promise<IProductTypeListRawIntlResponseItem[]>;
}

export const AdminProductTypesListPresenter = ({
  View,
  adminProductTypesState: { isListLoading, entities: productTypes, get: getProductTypes, hasListLoaded, meta },
  intlState: { availableLocales },
  searchService,
}: IProps & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getProductTypes();
  }, [getProductTypes]);

  const onPageChange = React.useCallback(
    page => {
      getProductTypes(page);
    },
    [getProductTypes],
  );

  const search = React.useCallback(
    async (query: string) => {
      const {
        entities: { productTypes },
        result: { productTypes: productTypesOrder },
      } = await searchService.searchRawIntl(query);

      return agregateOrderedMapToArray(productTypes, productTypesOrder, productType => ({
        ...productType,
        name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
        description: extendIntlTextWithLocaleNames({}, availableLocales),
        short_description: extendIntlTextWithLocaleNames(productType.short_description, availableLocales),
      })) as IProductTypeListRawIntlResponseItem[];
    },
    [searchService, availableLocales],
  );

  return (
    <View
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      locales={availableLocales.map(({ name }) => name)}
      productTypes={productTypes}
      onPageChange={onPageChange}
      search={search}
    />
  );
};
