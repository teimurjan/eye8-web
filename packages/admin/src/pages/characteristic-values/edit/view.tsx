import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/characteristic-values/create/fields';
import { IViewProps as IProps } from '@eye8/admin/pages/characteristic-values/edit/presenter';

export const AdminCharacteristicValuesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  initialValues,
  validate,
  preloadingError,
  characteristics,
}: IProps) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminCharacteristicValuesEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminCharacteristicValues.edit.title' })}
      fields={<Fields characteristics={characteristics} />}
      validate={validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
