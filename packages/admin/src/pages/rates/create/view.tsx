import React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from '@eye8/admin/pages/rates/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/rates/create/presenter';

import { ModalForm } from '../../../components';

export const AdminRatesCreateView = ({ isOpen, create, close, error, validate, isCreating }: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminRatesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminRates.create.title' })}
      fields={<Fields />}
      validate={validate}
      wide
    />
  );
};
