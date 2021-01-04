import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/categories/create/fields';
import { CATEGORY_NAME_FIELD_KEY, IViewProps as IProps } from '@eye8/admin/pages/categories/create/presenter';

export const AdminCategoriesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  validate,
  categories,
  preloadingError,
  isCreating,
}: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminCategoriesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={isLoading}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminCategories.create.title' })}
      fields={<Fields categories={categories} nameFieldKey={CATEGORY_NAME_FIELD_KEY} />}
      validate={validate}
    />
  );
};
