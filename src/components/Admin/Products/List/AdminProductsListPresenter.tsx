import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { IContextValue as AdminProductsContextValue } from 'src/state/AdminProductsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  products: AdminProductsContextValue['adminProductsState']['products'];
  meta: AdminProductsContextValue['adminProductsState']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, products, getProducts, hasListLoaded, meta },
}: IProps & AdminProductsContextValue & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const onPageChange = React.useCallback(
    page => {
      getProducts(page);
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
