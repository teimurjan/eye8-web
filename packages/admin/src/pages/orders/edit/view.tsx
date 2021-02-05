import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';

import Fields from './fields';
import { ViewProps as Props } from './presenter';

const AdminOrdersEditView = ({
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

export default AdminOrdersEditView;
