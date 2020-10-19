import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/ModalForm';
import { Fields } from 'src/components/admin/pages/PromoCodes/Create/Fields';
import { IViewProps as IProps } from 'src/components/admin/pages/PromoCodes/Edit/AdminPromoCodesEditPresenter';

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
