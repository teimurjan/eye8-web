import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';
import { Fields } from '../create';

import { CATEGORY_NAME_FIELD_KEY, ViewProps as Props } from './presenter';

const AdminCategoriesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  validate,
  categories,
  preloadingError,
  initialValues,
}: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminCategoriesEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminCategories.edit.title' })}
      fields={<Fields categories={categories} nameFieldKey={CATEGORY_NAME_FIELD_KEY} />}
      validate={validate}
      initialValues={initialValues}
    />
  );
};

export default AdminCategoriesEditView;
