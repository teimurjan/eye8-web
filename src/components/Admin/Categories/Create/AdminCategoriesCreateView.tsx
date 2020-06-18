import * as React from 'react';
import { IntlShape } from 'react-intl';

import {
  CATEGORY_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/Categories/Create/AdminCategoriesCreatePresenter';
import { Fields } from 'src/components/Admin/Categories/Create/Fields';
import { ModalForm } from 'src/components/Admin/ModalForm';

export const AdminCategoriesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  availableLocales,
  validate,
  categories,
  preloadingError,
  isCreating,
}: IProps & { intl: IntlShape }) => (
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
    fields={
      <Fields availableLocales={availableLocales} categories={categories} nameFieldKey={CATEGORY_NAME_FIELD_KEY} />
    }
    validate={validate}
  />
);
