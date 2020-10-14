import * as React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from 'src/components/Admin/CharacteristicValues/Create/Fields';
import { IViewProps as IProps } from 'src/components/Admin/CharacteristicValues/Edit/AdminCharacteristicValuesEditPresenter';
import { ModalForm } from 'src/components/Admin/ModalForm';

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
