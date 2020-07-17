import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import { IViewProps as IProps } from 'src/components/Admin/Orders/Edit/AdminOrdersEditPresenter';
import { Fields } from 'src/components/Admin/Orders/Edit/Fields';

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
  promoCode,
}: IProps) => {
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
      fields={<Fields promoCode={promoCode} />}
      validate={validate}
      initialValues={initialValues}
      wide
    />
  );
};
