import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';

import Fields from './fields';
import { ViewProps as Props } from './presenter';

const AdminFeatureTypesCreateView = ({ isOpen, create, close, isLoading, error, validate }: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminFeatureTypesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminFeatureTypes.create.title' })}
      fields={<Fields />}
      validate={validate}
    />
  );
};

export default AdminFeatureTypesCreateView;
