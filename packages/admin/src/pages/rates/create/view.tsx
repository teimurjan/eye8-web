import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/rates/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/rates/create/presenter';

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
