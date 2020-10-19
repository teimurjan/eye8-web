import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/form/ModalForm';
import { Fields } from 'src/components/admin/pages/Banners/Create/Fields';
import {
  BANNER_TEXT_FIELD_KEY,
  BANNER_LINK_TEXT_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/admin/pages/Banners/Edit/AdminBannersEditPresenter';

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
}: IProps) => {
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
