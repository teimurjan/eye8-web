import React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from '@eye8/admin/pages/products/create/fields';
import { ViewProps as Props } from '@eye8/admin/pages/products/create/presenter';

import { ModalForm } from '../../../components';

export const AdminProductsCreateView = ({
  isOpen,
  create,
  close,
  featureValuesLoading,
  error,
  validate,
  preloadingError,
  isCreating,
  featureValues,
  productTypes,
  LoadMoreProductTypes,
  productTypesLoading,
}: Props) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminProductsCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminProducts.create.title' })}
      fields={
        <Fields
          productTypes={productTypes}
          featureValues={featureValues}
          LoadMoreProductTypes={LoadMoreProductTypes}
          productTypesLoading={productTypesLoading}
          featureValuesLoading={featureValuesLoading}
        />
      }
      validate={validate}
      wide
    />
  );
};
