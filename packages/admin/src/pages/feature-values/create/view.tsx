import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';

import Fields from './fields';
import { ViewProps as Props } from './presenter';


const AdminFeatureValuesCreateView = ({
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

export default AdminFeatureValuesCreateView;
