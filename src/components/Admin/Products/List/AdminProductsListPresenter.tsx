import { History } from 'history';
import * as React from 'react';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { useSelectProductTypes } from 'src/components/Admin/ProductTypeSelect/useSelectProductTypes';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { ContextValue as AdminProductsStateContextValue } from 'src/state/AdminProductsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { buildQueryString } from 'src/utils/queryString';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminProductsState: AdminProductsStateContextValue['state'];
  productTypeId?: string;
  productTypeService: IProductTypeService;
  history: History;
}

export interface IViewProps {
  products: AdminProductsStateContextValue['state']['entities'];
  meta: AdminProductsStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  selectedProductTypeId?: string;
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  onProductTypeChange: (id?: string) => void;
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
  productTypeId,
  productTypeService,
  history,
}: IProps & IntlStateContextValue) => {
  const productTypeIdInt = productTypeId ? parseInt(productTypeId, 10) : undefined;
  React.useEffect(() => {
    getProducts(productTypeIdInt ? { productTypeId: productTypeIdInt, page: 1 } : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeId]);

  const { productTypes, isLoading: productTypesLoading, loadMore: LoadMoreProductTypes } = useSelectProductTypes({
    productTypeService,
    mandatoryProductTypeId: productTypeIdInt,
  });

  const onPageChange = React.useCallback(
    (page: number) => {
      getProducts({ page });
    },
    [getProducts],
  );

  const onProductTypeChange = (id?: string) => {
    history.replace(`${history.location.pathname}${buildQueryString({ productTypeId: id })}`);
  };

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
