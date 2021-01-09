import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/banners/create/fields';
import {
  BANNER_TEXT_FIELD_KEY,
  BANNER_LINK_TEXT_FIELD_KEY,
  ViewProps as Props,
} from '@eye8/admin/pages/banners/edit/presenter';

export const AdminBannersEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  validate,
  preloadingError,
  initialValues,
}: Props) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminBannersEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminBanners.edit.title' })}
      fields={<Fields textFieldKey={BANNER_TEXT_FIELD_KEY} linkTextFieldKey={BANNER_LINK_TEXT_FIELD_KEY} />}
      validate={validate}
      initialValues={initialValues}
    />
  );
};
