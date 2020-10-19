import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/form/ModalForm';
import {
  CATEGORY_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/admin/pages/Categories/Create/AdminCategoriesCreatePresenter';
import { Fields } from 'src/components/admin/pages/Categories/Create/Fields';

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
