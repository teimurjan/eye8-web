import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/orders/edit/fields';
import { ViewProps as Props } from '@eye8/admin/pages/orders/edit/presenter';

export const AdminOrdersEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  error,
  validate,
  preloadingError,
  isUpdating,
  initialValues,
  ...promoCodeProps
}: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminOrdersEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminOrders.edit.title' })}
      fields={<Fields {...promoCodeProps} />}
      validate={validate}
      initialValues={initialValues}
      wide
    />
  );
};
