import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/ModalForm';
import { Fields } from 'src/components/admin/pages/Products/Create/Fields';
import { IViewProps as IProps } from 'src/components/admin/pages/Products/Edit/AdminProductsEditPresenter';

export const AdminProductsEditView = ({
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
}: IProps) => {
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
