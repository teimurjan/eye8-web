import * as React from 'react';
import { useHistory } from 'react-router';

import {
  AdminCharacteristicValuesCreatePresenter,
  IProps as IPresenterProps,
} from 'src/components/Admin/CharacteristicValues/Create/AdminCharacteristicValuesCreatePresenter';
import { AdminCharacteristicValuesCreateView } from 'src/components/Admin/CharacteristicValues/Create/AdminCharacteristicValuesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/Admin/AdminCharacteristicsState';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';

export const AdminCharacteristicValuesCreateContainer = ({ close }: Partial<Pick<IPresenterProps, 'close'>>) => {
  const history = useHistory();
  const defaultClose = React.useCallback(() => history.push('/admin/characteristicValues'), [history]);

  const { dependencies } = useDependencies();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesCreatePresenter
      close={close ? close : defaultClose}
      View={AdminCharacteristicValuesCreateView}
      service={dependencies.services.characteristicValue}
      adminCharacteristicsState={adminCharacteristicsState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
