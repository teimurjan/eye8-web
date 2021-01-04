import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/feature-values/create/fields';
import { IViewProps as IProps } from '@eye8/admin/pages/feature-values/create/presenter';

export const AdminFeatureValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  featureTypes,
  validate,
}: IProps) => {
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
