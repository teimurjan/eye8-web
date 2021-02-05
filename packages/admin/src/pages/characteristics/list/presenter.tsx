import React from 'react';

import { AdminCharacteristicsState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminCharacteristicsState: AdminCharacteristicsState;
}

export interface ViewProps {
  characteristics: AdminCharacteristicsState['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

const AdminCharacteristicsListPresenter = ({
  View,
  adminCharacteristicsState: { isListLoading, entities: characteristics, get: getCharacteristics, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getCharacteristics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} characteristics={characteristics} />;
};

export default AdminCharacteristicsListPresenter;
