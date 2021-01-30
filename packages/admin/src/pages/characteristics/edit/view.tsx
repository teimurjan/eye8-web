import React from 'react';
import { useIntl } from 'react-intl';

import { CHARACTERISTIC_NAME_FIELD_KEY, ViewProps as Props } from '@eye8/admin/pages/characteristics/edit/presenter';

import { IntlField } from '../../../components';
import { ModalForm } from '../../../components';

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

export const AdminCharacteristicsEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  initialValues,
  validate,
  preloadingError,
}: Props) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminCharacteristicsEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminCharacteristics.edit.title' })}
      fields={<Fields />}
      validate={validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
