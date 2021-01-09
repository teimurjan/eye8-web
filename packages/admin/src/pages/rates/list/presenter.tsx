import React from 'react';

import { ContextValue as AdminRatesContextValue } from '@eye8/admin/state/rates';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminRatesState: AdminRatesContextValue['state'];
}

export interface ViewProps {
  rates: AdminRatesContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminRatesListPresenter = ({
  View,
  adminRatesState: { isListLoading, entities: rates, get: getRates, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} rates={rates} />;
};
