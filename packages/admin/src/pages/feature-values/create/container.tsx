import React from 'react';
import { useHistory } from 'react-router';

import {
  AdminFeatureValuesCreatePresenter,
  Props as PresenterProps,
} from '@eye8/admin/pages/feature-values/create/presenter';
import { AdminFeatureValuesCreateView } from '@eye8/admin/pages/feature-values/create/view';
import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState } from '../../../state';
import { useAdminFeatureValuesState } from '../../../state';

export const AdminFeatureValuesCreateContainer = ({ close }: Partial<Pick<PresenterProps, 'close'>>) => {
  const history = useHistory();
  const defaultClose = React.useCallback(() => history.push('/admin/featureValues'), [history]);

  const { di } = useDI();
  const adminFeatureTypesState = useAdminFeatureTypesState();
  const adminFeatureValuesState = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesCreatePresenter
      close={close ?? defaultClose}
      View={AdminFeatureValuesCreateView}
      service={di.service.featureValue}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
