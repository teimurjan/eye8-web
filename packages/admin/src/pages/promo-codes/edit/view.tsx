import React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from '@eye8/admin/pages/promo-codes/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/promo-codes/edit/presenter';

import { ModalForm } from '../../../components';

export const AdminPromoCodesEditView = ({
  isOpen,
  edit,
  close,
  error,
  isUpdating,
  isLoading,
  initialValues,
}: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminPromoCodesEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminPromoCodes.edit.title' })}
      fields={<Fields isEdit />}
      initialValues={initialValues}
      wide
    />
  );
};
