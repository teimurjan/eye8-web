import React from 'react';

import { ContextValue as AdminCharacteristicsContextValue } from '@eye8/admin/state/characteristics';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminCharacteristicsState: AdminCharacteristicsContextValue['state'];
}

export interface ViewProps {
  characteristics: AdminCharacteristicsContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminCharacteristicsListPresenter = ({
  View,
  adminCharacteristicsState: { isListLoading, entities: characteristics, get: getCharacteristics, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getCharacteristics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} characteristics={characteristics} />;
};
