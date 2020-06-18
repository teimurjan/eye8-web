import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminFeatureValuesCreatePresenter } from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreatePresenter';
import { AdminFeatureValuesCreateView } from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminFeatureValuesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureValuesCreatePresenter
      history={history}
      View={injectIntl(AdminFeatureValuesCreateView)}
      service={dependencies.services.featureValue}
      intlState={intlState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
