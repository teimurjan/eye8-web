import React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from '@eye8/admin/pages/categories/create/fields';
import { CATEGORY_NAME_FIELD_KEY, ViewProps as Props } from '@eye8/admin/pages/categories/edit/presenter';

import { ModalForm } from '../../../components';

export const AdminCategoriesEditView = ({
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
