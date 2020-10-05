import * as React from 'react';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Admin/CharacteristicValues/Create/AdminCharacteristicValuesCreatePresenter';
import { Fields } from 'src/components/Admin/CharacteristicValues/Create/Fields';
import { ModalForm } from 'src/components/Admin/ModalForm';

export const AdminCharacteristicValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  availableLocales,
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
      fields={<Fields availableLocales={availableLocales} characteristics={characteristics} />}
      validate={validate}
    />
  );
};
