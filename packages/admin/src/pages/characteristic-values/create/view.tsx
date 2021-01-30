import React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from '@eye8/admin/pages/characteristic-values/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/characteristic-values/create/presenter';

import { ModalForm } from '../../../components';

export const AdminCharacteristicValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  characteristics,
  validate,
}: Props) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminCharacteristicValuesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminCharacteristicValues.create.title' })}
      fields={<Fields characteristics={characteristics} />}
      validate={validate}
    />
  );
};
