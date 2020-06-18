import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { IContextValue as AdminProductTypesContextValue } from 'src/state/AdminProductTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  productTypes: AdminProductTypesContextValue['adminProductTypesState']['productTypes'];
  meta: AdminProductTypesContextValue['adminProductTypesState']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
  onPageChange: (page: number) => void;
}

export const AdminProductTypesListPresenter = ({
  View,
  adminProductTypesState: { isListLoading, productTypes, getProductTypes, hasListLoaded, meta },
  intlState: { availableLocales },
}: IProps & AdminProductTypesContextValue & IntlStateContextValue) => {
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

  return (
    <View
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      locales={availableLocales.map(({ name }) => name)}
      productTypes={productTypes}
      onPageChange={onPageChange}
    />
  );
};
