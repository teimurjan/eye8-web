import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/categories/create/fields';
import { CATEGORY_NAME_FIELD_KEY, IViewProps as IProps } from '@eye8/admin/pages/categories/edit/presenter';

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
}: IProps) => {
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
