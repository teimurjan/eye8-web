import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';
import { Fields } from '../create';

import { ViewProps as Props } from './presenter';

const AdminPromoCodesEditView = ({ isOpen, edit, close, error, isUpdating, isLoading, initialValues }: Props) => {
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

export default AdminPromoCodesEditView;
