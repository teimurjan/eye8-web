import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState, useAdminFeatureValuesState } from '../../../state';

import AdminFeatureValuesCreatePresenter, { Props as PresenterProps } from './presenter';
import AdminFeatureValuesCreateView from './view';

const AdminFeatureValuesCreateContainer = ({ close }: Partial<Pick<PresenterProps, 'close'>>) => {
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

export default AdminFeatureValuesCreateContainer;
