import React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from '@eye8/admin/pages/feature-values/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/feature-values/create/presenter';

import { ModalForm } from '../../../components';

export const AdminFeatureValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  featureTypes,
  validate,
}: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminFeatureValuesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminFeatureValues.create.title' })}
      fields={<Fields featureTypes={featureTypes} />}
      validate={validate}
    />
  );
};
