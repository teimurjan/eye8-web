import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/characteristic-values/create/fields';
import { IViewProps as IProps } from '@eye8/admin/pages/characteristic-values/create/presenter';

export const AdminCharacteristicValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  characteristics,
  validate,
}: IProps) => {
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
