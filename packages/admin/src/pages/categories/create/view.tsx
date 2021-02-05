import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';

import Fields from './fields';
import { CATEGORY_NAME_FIELD_KEY, ViewProps as Props } from './presenter';

const AdminCategoriesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  validate,
  categories,
  preloadingError,
  isCreating,
}: Props) => {
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

export default AdminCategoriesCreateView;
