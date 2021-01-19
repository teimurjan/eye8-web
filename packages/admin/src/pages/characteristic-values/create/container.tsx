import React from 'react';
import { useHistory } from 'react-router';

import {
  AdminCharacteristicValuesCreatePresenter,
  Props as PresenterProps,
} from '@eye8/admin/pages/characteristic-values/create/presenter';
import { AdminCharacteristicValuesCreateView } from '@eye8/admin/pages/characteristic-values/create/view';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';
import { useDI } from '@eye8/di';

export const AdminCharacteristicValuesCreateContainer = ({ close }: Partial<Pick<PresenterProps, 'close'>>) => {
  const history = useHistory();
  const defaultClose = React.useCallback(() => history.push('/admin/characteristicValues'), [history]);

  const { di } = useDI();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesCreatePresenter
      close={close ? close : defaultClose}
      View={AdminCharacteristicValuesCreateView}
      service={di.service.characteristicValue}
      adminCharacteristicsState={adminCharacteristicsState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
