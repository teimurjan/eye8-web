import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { ContextValue as AdminProductsStateContextValue } from 'src/state/AdminProductsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminProductsState: AdminProductsStateContextValue['state'];
}

export interface IViewProps {
  products: AdminProductsStateContextValue['state']['entities'];
  meta: AdminProductsStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
}: IProps & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const onPageChange = React.useCallback(
    (page: number) => {
      getProducts({ page });
    },
    [getProducts],
  );

  return (
    <View
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      products={products}
      onPageChange={onPageChange}
    />
  );
};
