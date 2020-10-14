import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import {
  AdminFeatureValuesCreatePresenter,
  IProps as IPresenterProps,
} from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreatePresenter';
import { AdminFeatureValuesCreateView } from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';

const View = injectIntl(AdminFeatureValuesCreateView);

export const AdminFeatureValuesCreateContainer = ({ close }: Partial<Pick<IPresenterProps, 'close'>>) => {
  const history = useHistory();
  const defaultClose = React.useCallback(() => history.push('/admin/featureValues'), [history]);

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesCreatePresenter
      close={close ? close : defaultClose}
      View={View}
      service={dependencies.services.featureValue}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
