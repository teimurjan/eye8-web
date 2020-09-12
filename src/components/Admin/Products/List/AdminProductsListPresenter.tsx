import { History } from 'history';
import * as React from 'react';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { useSelectProductTypes } from 'src/components/Admin/ProductTypeSelect/useSelectProductTypes';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { ContextValue as AdminProductsStateContextValue } from 'src/state/AdminProductsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminProductsState: AdminProductsStateContextValue['state'];
  productTypeId?: number;
  productTypeService: IProductTypeService;
  history: History;
  onProductTypeChange: (id?: number) => void;
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
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
  productTypeId,
  productTypeService,
  onProductTypeChange,
}: IProps & IntlStateContextValue) => {
  React.useEffect(() => {
    getProducts({ productTypeId, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeId]);

  const { productTypes, isLoading: productTypesLoading, loadMore: LoadMoreProductTypes } = useSelectProductTypes({
    productTypeService,
    mandatoryProductTypeId: productTypeId,
  });

  const onPageChange = React.useCallback(
    (page: number) => {
      getProducts({ page });
    },
    [getProducts],
  );

  return (
    <View
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
