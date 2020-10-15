import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminFeatureTypesCreatePresenter } from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreatePresenter';
import { AdminFeatureTypesCreateView } from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';

const View = injectIntl(AdminFeatureTypesCreateView);

export const AdminFeatureTypesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesCreatePresenter
      history={history}
      View={View}
      service={dependencies.services.featureType}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
