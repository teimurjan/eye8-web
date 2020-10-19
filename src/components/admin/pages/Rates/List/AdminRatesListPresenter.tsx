import * as React from 'react';

import { ContextValue as AdminRatesContextValue } from 'src/state/Admin/AdminRatesState';

export interface IProps {
  View: React.ComponentType<IViewProps>;
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
}: IProps) => {
  React.useEffect(() => {
    getRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} rates={rates} />;
};
