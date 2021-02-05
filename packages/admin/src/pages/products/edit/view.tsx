import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';
import { Fields } from '../create';

import { ViewProps as Props } from './presenter';

const AdminProductsEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  error,
  validate,
  productTypes,
  preloadingError,
  isUpdating,
  featureValues,
  initialValues,
  LoadMoreProductTypes,
  productTypesLoading,
  featureValuesLoading,
}: Props) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminProductsEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminProducts.edit.title' })}
      fields={
        <Fields
          productTypesLoading={productTypesLoading}
          featureValuesLoading={featureValuesLoading}
          LoadMoreProductTypes={LoadMoreProductTypes}
          productTypes={productTypes}
          featureValues={featureValues}
        />
      }
      validate={validate}
      initialValues={initialValues}
      wide
    />
  );
};

export default AdminProductsEditView;
