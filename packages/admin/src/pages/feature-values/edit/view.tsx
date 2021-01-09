import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/feature-values/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/feature-values/edit/presenter';

export const AdminFeatureValuesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  initialValues,
  validate,
  preloadingError,
  featureTypes,
}: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminFeatureValuesEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminFeatureValues.edit.title' })}
      fields={<Fields featureTypes={featureTypes} />}
      validate={validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
