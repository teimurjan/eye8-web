import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureValuesEditPresenter } from 'src/components/Admin/FeatureValues/Edit/AdminFeatureValuesEditPresenter';
import { AdminFeatureValuesEditView } from 'src/components/Admin/FeatureValues/Edit/AdminFeatureValuesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';

const View = injectIntl(AdminFeatureValuesEditView);

export const AdminFeatureValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesEditPresenter
      featureValueId={parseInt(params.id, 10)}
      history={history}
      View={View}
      service={dependencies.services.featureValue}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
