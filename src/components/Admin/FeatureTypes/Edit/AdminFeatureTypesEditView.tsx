import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/FeatureTypes/Edit/AdminFeatureTypesEditPresenter';
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

export const AdminFeatureTypesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  intl,
  initialValues,
  availableLocales,
  validate,
  preloadingError,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminFeatureTypesEditForm"
    isOpen={isOpen}
    onSubmit={edit}
    onClose={close}
    isLoading={isUpdating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminFeatureTypes.edit.title' })}
    fields={<Fields availableLocales={availableLocales} />}
    validate={validate}
    initialValues={initialValues}
    preloadingError={preloadingError}
  />
);
