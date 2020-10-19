import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/ModalForm';
import { IViewProps as IProps } from 'src/components/admin/pages/Orders/Edit/AdminOrdersEditPresenter';
import { Fields } from 'src/components/admin/pages/Orders/Edit/Fields';

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
      fields={<Fields {...promoCodeProps} />}
      validate={validate}
      initialValues={initialValues}
      wide
    />
  );
};
