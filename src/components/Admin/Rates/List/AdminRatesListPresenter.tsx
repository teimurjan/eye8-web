import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { ContextValue as AdminRatesContextValue } from 'src/state/AdminRatesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminRatesState: AdminRatesContextValue['state'];
}

export interface IViewProps {
  rates: AdminRatesContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminRatesListPresenter = ({
  View,
  adminRatesState: { isListLoading, entities: rates, get: getRates, hasListLoaded },
}: IProps & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getRates();
  }, [getRates]);

  return <View isDataLoaded={hasListLoaded} isLoading={isLoadingDebounced} rates={rates} />;
};
