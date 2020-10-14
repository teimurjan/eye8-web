import * as React from 'react';

import { IProductTypeListRawIntlResponseItem } from 'src/api/ProductTypeAPI';
import { ISearchService } from 'src/services/SearchService';
import { ContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';
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
  onPageChange: (page: number) => void;
  search: (query: string) => Promise<IProductTypeListRawIntlResponseItem[]>;
}

export const AdminProductTypesListPresenter = ({
  View,
  adminProductTypesState: { isListLoading, entities: productTypes, get: getProductTypes, hasListLoaded, meta },

  searchService,
}: IProps) => {
  React.useEffect(() => {
    getProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPageChange = React.useCallback(
    (page: number) => {
      getProductTypes({ page });
    },
    [getProductTypes],
  );

  const search = React.useCallback(
    async (query: string) => {
      const {
        entities: { productTypes },
        result: { productTypes: productTypesOrder },
      } = await searchService.searchRawIntl(query);

      return agregateOrderedMapToArray(productTypes, productTypesOrder, (productType) => ({
        ...productType,
        name: productType.name,
        description: productType.short_description,
        short_description: productType.short_description,
      })) as IProductTypeListRawIntlResponseItem[];
    },
    [searchService],
  );

  return (
    <View
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      productTypes={productTypes}
      onPageChange={onPageChange}
      search={search}
    />
  );
};
