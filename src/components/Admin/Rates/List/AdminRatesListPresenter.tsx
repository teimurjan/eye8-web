import * as React from 'react';

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
  React.useEffect(() => {
    getRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} rates={rates} />;
};
