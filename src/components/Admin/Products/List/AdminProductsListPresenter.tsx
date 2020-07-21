import * as React from 'react';

import { ContextValue as AdminProductsStateContextValue } from 'src/state/AdminProductsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminProductsState: AdminProductsStateContextValue['state'];
  productTypeId?: string;
}

export interface IViewProps {
  products: AdminProductsStateContextValue['state']['entities'];
  meta: AdminProductsStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  hasProductTypeFilter: boolean;
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
  productTypeId,
}: IProps & IntlStateContextValue) => {
  const hasProductTypeFilter = typeof productTypeId !== 'undefined';
  React.useEffect(() => {
    getProducts(hasProductTypeFilter ? { productTypeId: parseInt(productTypeId!, 10), page: 1 } : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasProductTypeFilter]);

  const onPageChange = React.useCallback(
    (page: number) => {
      getProducts({ page });
    },
    [getProducts],
  );

  return (
    <View
      hasProductTypeFilter={hasProductTypeFilter}
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      products={products}
      onPageChange={onPageChange}
    />
  );
};
