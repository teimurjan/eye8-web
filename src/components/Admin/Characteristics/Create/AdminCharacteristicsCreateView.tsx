import * as React from 'react';
import { useIntl } from 'react-intl';

import {
  CHARACTERISTIC_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/Characteristics/Create/AdminCharacteristicsCreatePresenter';
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

export const AdminCharacteristicsCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  availableLocales,
  validate,
}: IProps) => {
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
      fields={<Fields availableLocales={availableLocales} />}
      validate={validate}
    />
  );
};
