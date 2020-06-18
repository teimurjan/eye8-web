import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminFeatureTypesCreatePresenter } from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreatePresenter';
import { AdminFeatureTypesCreateView } from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminFeatureTypesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureTypesCreatePresenter
      history={history}
      View={injectIntl(AdminFeatureTypesCreateView)}
      service={dependencies.services.featureType}
      intlState={intlState}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
