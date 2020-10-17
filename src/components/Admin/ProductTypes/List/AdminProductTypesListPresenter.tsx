import * as React from 'react';

import { IProductTypeListRawIntlResponseItem } from 'src/api/ProductTypeAPI';
import { useAdminProductTypesFilters } from 'src/components/Admin/ProductTypes/useAdminProductTypesFilters';
import { ISearchService } from 'src/services/SearchService';
import { ContextValue as AdminProductTypesStateContextValue } from 'src/state/Admin/AdminProductTypesState';
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
  onDeletedModeChange: () => void;
  search: (query: string) => Promise<IProductTypeListRawIntlResponseItem[]>;
  isDeletedMode: boolean;
}

export const AdminProductTypesListPresenter = ({
  View,
  adminProductTypesState: { isListLoading, entities: productTypes, get: getProductTypes, hasListLoaded, meta },
  searchService,
}: IProps) => {
  const {
    filters: { deleted, forever },
    setFilters,
  } = useAdminProductTypesFilters();
  const isDeletedMode = deleted === true || forever === true;

  React.useEffect(() => {
    getProductTypes({ page: 1, deleted: isDeletedMode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletedMode]);

  const onDeletedModeChange = React.useCallback(() => {
    setFilters({ forever, deleted: !deleted });
  }, [forever, deleted, setFilters]);

  const onPageChange = React.useCallback(
    (page: number) => {
      getProductTypes({ page, deleted: isDeletedMode });
    },
    [getProductTypes, isDeletedMode],
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
      onDeletedModeChange={onDeletedModeChange}
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      productTypes={productTypes}
      onPageChange={onPageChange}
      isDeletedMode={isDeletedMode}
      search={search}
    />
  );
};
