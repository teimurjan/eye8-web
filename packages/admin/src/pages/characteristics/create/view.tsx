import React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from '@eye8/admin/components/intl-field';
import { ModalForm } from '@eye8/admin/components/modal-form';
import {
  CHARACTERISTIC_NAME_FIELD_KEY,
  ViewProps as Props,
} from '@eye8/admin/pages/characteristics/create/presenter';

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

export const AdminCharacteristicsCreateView = ({ isOpen, create, close, isLoading, error, validate }: Props) => {
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
