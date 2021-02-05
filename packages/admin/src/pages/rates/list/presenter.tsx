import React from 'react';

import { AdminRatesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminRatesState: AdminRatesState;
}

export interface ViewProps {
  rates: AdminRatesState['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

const AdminRatesListPresenter = ({
  View,
  adminRatesState: { isListLoading, entities: rates, get: getRates, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} rates={rates} />;
};

export default AdminRatesListPresenter;
