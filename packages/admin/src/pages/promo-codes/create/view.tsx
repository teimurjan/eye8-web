import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';

import Fields from './fields';
import { ViewProps as Props } from './presenter';

const AdminPromoCodesCreateView = ({ isOpen, create, close, error, validate, isCreating, initialValues }: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={initialValues}
      formID="adminPromoCodesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminPromoCodes.create.title' })}
      fields={<Fields />}
      validate={validate}
      wide
    />
  );
};

export default AdminPromoCodesCreateView;
