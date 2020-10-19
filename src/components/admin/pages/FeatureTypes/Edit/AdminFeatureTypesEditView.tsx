import * as React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from 'src/components/admin/form/IntlField';
import { ModalForm } from 'src/components/admin/form/ModalForm';
import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/admin/pages/FeatureTypes/Edit/AdminFeatureTypesEditPresenter';

const Fields = () => {
  const intl = useIntl();
  return (
    <IntlField
      key_={FEATURE_TYPE_NAME_FIELD_KEY}
      label={intl.formatMessage({
        id: 'AdminFeatureTypes.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminFeatureTypes.nameInput.placeholder',
      })}
    />
  );
};

export const AdminFeatureTypesEditView = ({
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
};
