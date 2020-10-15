import { History } from 'history';
import * as React from 'react';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { useSelectProductTypes } from 'src/components/Admin/ProductTypeSelect/useSelectProductTypes';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { useAdminProductsFiltersState } from 'src/state/Admin/AdminProductsFiltersState';
import { ContextValue as AdminProductsStateContextValue } from 'src/state/Admin/AdminProductsState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminProductsState: AdminProductsStateContextValue['state'];
  productTypeService: IProductTypeService;
  history: History;
}

export interface IViewProps {
  products: AdminProductsStateContextValue['state']['entities'];
  meta: AdminProductsStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  selectedProductTypeId?: number;
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  onProductTypeChange: (id?: number) => void;
  onAvailabilityChange: () => void;
  available: boolean;
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
  productTypeService,
}: IProps) => {
  const {
    adminProductsFiltersState: { filters, setFilters },
  } = useAdminProductsFiltersState();

  const productTypeId = filters.productTypeId as number;
  const available = filters.available as boolean;

  const onProductTypeChange = React.useCallback(
    (productTypeId_?: number) => {
      setFilters({ ...filters, productTypeId: productTypeId_ });
    },
    [setFilters, filters],
  );

  const onAvailabilityChange = React.useCallback(() => {
    setFilters({ ...filters, available: !available });
  }, [setFilters, filters, available]);

  React.useEffect(() => {
    getProducts({ productTypeId, page: 1, available });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeId, available]);

  const { productTypes, isLoading: productTypesLoading, loadMore: LoadMoreProductTypes } = useSelectProductTypes({
    productTypeService,
    mandatoryProductTypeId: productTypeId,
  });

  const onPageChange = React.useCallback(
    (page: number) => {
      getProducts({ page, available });
    },
    [getProducts, available],
  );

  return (
    <View
      available={available}
      onAvailabilityChange={onAvailabilityChange}
      selectedProductTypeId={productTypeId}
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      products={products}
      onPageChange={onPageChange}
      productTypes={productTypes}
      productTypesLoading={productTypesLoading}
      LoadMoreProductTypes={LoadMoreProductTypes}
      onProductTypeChange={onProductTypeChange}
    />
  );
};
