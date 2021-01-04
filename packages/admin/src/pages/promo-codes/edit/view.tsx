import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/promo-codes/create/fields';
import { IViewProps as IProps } from '@eye8/admin/pages/promo-codes/edit/presenter';

export const AdminPromoCodesEditView = ({
  isOpen,
  edit,
  close,
  error,
  isUpdating,
  isLoading,
  initialValues,
}: IProps) => {
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
