import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';
import { Fields } from '../create';

import { BANNER_TEXT_FIELD_KEY, BANNER_LINK_TEXT_FIELD_KEY, ViewProps as Props } from './presenter';

const AdminBannersEditView = ({
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

export default AdminBannersEditView;
