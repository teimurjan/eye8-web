import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { IContextValue as AdminRatesContextValue } from 'src/state/AdminRatesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  rates: AdminRatesContextValue['adminRatesState']['rates'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminRatesListPresenter = ({
  View,
  adminRatesState: { isListLoading, rates, getRates, hasListLoaded },
}: IProps & AdminRatesContextValue & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getRates();
  }, [getRates]);

  return <View isDataLoaded={hasListLoaded} isLoading={isLoadingDebounced} rates={rates} />;
};
