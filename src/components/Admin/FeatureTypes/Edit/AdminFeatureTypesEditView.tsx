import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/FeatureTypes/Edit/AdminFeatureTypesEditPresenter';
import { IntlField } from 'src/components/Admin/IntlField';
import { ModalForm } from 'src/components/Admin/ModalForm';

const Fields = injectIntl(({ intl }: { intl: IntlShape }) => (
  <IntlField
    key_={FEATURE_TYPE_NAME_FIELD_KEY}
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
    fields={<Fields />}
    validate={validate}
    initialValues={initialValues}
    preloadingError={preloadingError}
  />
);
