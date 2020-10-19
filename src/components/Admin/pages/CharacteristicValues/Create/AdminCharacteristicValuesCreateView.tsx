import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/ModalForm';
import { IViewProps as IProps } from 'src/components/admin/pages/CharacteristicValues/Create/AdminCharacteristicValuesCreatePresenter';
import { Fields } from 'src/components/admin/pages/CharacteristicValues/Create/Fields';

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
