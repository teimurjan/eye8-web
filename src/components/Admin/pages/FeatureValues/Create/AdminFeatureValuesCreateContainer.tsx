import * as React from 'react';
import { useHistory } from 'react-router';

import {
  AdminFeatureValuesCreatePresenter,
  IProps as IPresenterProps,
} from 'src/components/admin/pages/FeatureValues/Create/AdminFeatureValuesCreatePresenter';
import { AdminFeatureValuesCreateView } from 'src/components/admin/pages/FeatureValues/Create/AdminFeatureValuesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';

export const AdminFeatureValuesCreateContainer = ({ close }: Partial<Pick<IPresenterProps, 'close'>>) => {
  const history = useHistory();
  const defaultClose = React.useCallback(() => history.push('/admin/featureValues'), [history]);

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesCreatePresenter
      close={close ?? defaultClose}
      View={AdminFeatureValuesCreateView}
      service={dependencies.services.featureValue}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
