import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import { IViewProps as IProps } from 'src/components/Admin/Products/Create/AdminProductsCreatePresenter';
import { Fields } from 'src/components/Admin/Products/Create/Fields';

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
}: IProps) => {
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
