import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';

import Fields from './fields';
import { ViewProps as Props } from './presenter';

const AdminProductsCreateView = ({
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

export default AdminProductsCreateView;
