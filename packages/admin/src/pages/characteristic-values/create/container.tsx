import React from 'react';
import { useHistory } from 'react-router';

import {
  AdminCharacteristicValuesCreatePresenter,
  Props as PresenterProps,
} from '@eye8/admin/pages/characteristic-values/create/presenter';
import { AdminCharacteristicValuesCreateView } from '@eye8/admin/pages/characteristic-values/create/view';
import { useDI } from '@eye8/di';

import { useAdminCharacteristicValuesState } from '../../../state';
import { useAdminCharacteristicsState } from '../../../state';

export const AdminCharacteristicValuesCreateContainer = ({ close }: Partial<Pick<PresenterProps, 'close'>>) => {
  const history = useHistory();
  const defaultClose = React.useCallback(() => history.push('/admin/characteristicValues'), [history]);

  const { di } = useDI();
  const adminCharacteristicsState = useAdminCharacteristicsState();
  const adminCharacteristicValuesState = useAdminCharacteristicValuesState();

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
