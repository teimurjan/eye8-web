import * as React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from 'src/components/admin/form/IntlField';
import { ModalForm } from 'src/components/admin/form/ModalForm';
import {
  CHARACTERISTIC_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/admin/pages/Characteristics/Edit/AdminCharacteristicsEditPresenter';

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
}: IProps) => {
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
