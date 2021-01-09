import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/promo-codes/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/promo-codes/create/presenter';

export const AdminPromoCodesCreateView = ({
  isOpen,
  create,
  close,
  error,
  validate,
  isCreating,
  initialValues,
}: Props) => {
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
