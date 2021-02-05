import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminCharacteristicValuesState, useAdminCharacteristicsState } from '../../../state';

import AdminCharacteristicValuesCreatePresenter, { Props as PresenterProps } from './presenter';
import AdminCharacteristicValuesCreateView from './view';

const AdminCharacteristicValuesCreateContainer = ({ close }: Partial<Pick<PresenterProps, 'close'>>) => {
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

export default AdminCharacteristicValuesCreateContainer;
