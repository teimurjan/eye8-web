import * as React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from 'src/components/admin/form/IntlField';
import { ModalForm } from 'src/components/admin/form/ModalForm';
import {
  CHARACTERISTIC_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/admin/pages/Characteristics/Create/AdminCharacteristicsCreatePresenter';

const Fields = () => {
  const intl = useIntl();

  return (
    <IntlField
      key_={CHARACTERISTIC_NAME_FIELD_KEY}
      label={intl.formatMessage({
        id: 'AdminCharacteristics.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminCharacteristics.nameInput.placeholder',
      })}
    />
  );
};

export const AdminCharacteristicsCreateView = ({ isOpen, create, close, isLoading, error, validate }: IProps) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminCharacteristicsCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminCharacteristics.create.title' })}
      fields={<Fields />}
      validate={validate}
    />
  );
};
