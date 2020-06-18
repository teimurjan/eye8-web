import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreatePresenter';
import { IntlField } from 'src/components/Admin/IntlField';
import { ModalForm } from 'src/components/Admin/ModalForm';

interface IFieldsProps {
  availableLocales: IProps['availableLocales'];
}

const Fields = injectIntl(({ availableLocales, intl }: IFieldsProps & { intl: IntlShape }) => (
  <IntlField
    key_={FEATURE_TYPE_NAME_FIELD_KEY}
    locales={availableLocales}
    label={intl.formatMessage({
      id: 'AdminFeatureTypes.nameInput.label',
    })}
    placeholder={intl.formatMessage({
      id: 'AdminFeatureTypes.nameInput.placeholder',
    })}
  />
));

export const AdminFeatureTypesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  availableLocales,
  validate,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminFeatureTypesCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminFeatureTypes.create.title' })}
    fields={<Fields availableLocales={availableLocales} />}
    validate={validate}
  />
);
