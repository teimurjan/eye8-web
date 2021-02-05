import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';
import { Fields } from '../create';

import { ViewProps as Props } from './presenter';

const AdminFeatureValuesEditView = ({
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

export default AdminFeatureValuesEditView;
