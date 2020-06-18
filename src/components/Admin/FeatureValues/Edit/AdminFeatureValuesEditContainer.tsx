import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureValuesEditPresenter } from 'src/components/Admin/FeatureValues/Edit/AdminFeatureValuesEditPresenter';
import { AdminFeatureValuesEditView } from 'src/components/Admin/FeatureValues/Edit/AdminFeatureValuesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminFeatureValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureValuesEditPresenter
      featureValueId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminFeatureValuesEditView)}
      service={dependencies.services.featureValue}
      intlState={intlState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
