import * as React from 'react';
import { useIntl } from 'react-intl';

import {
  CHARACTERISTIC_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/Characteristics/Edit/AdminCharacteristicsEditPresenter';
import { IntlField } from 'src/components/Admin/IntlField';
import { ModalForm } from 'src/components/Admin/ModalForm';

interface IFieldsProps {
  availableLocales: IProps['availableLocales'];
}

const Fields = ({ availableLocales }: IFieldsProps) => {
  const intl = useIntl();

  return (
    <IntlField
      key_={CHARACTERISTIC_NAME_FIELD_KEY}
      locales={availableLocales}
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
  availableLocales,
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
      fields={<Fields availableLocales={availableLocales} />}
      validate={validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
