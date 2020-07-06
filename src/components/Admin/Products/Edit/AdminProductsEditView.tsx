import * as React from 'react';
import { IntlShape } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import { Fields } from 'src/components/Admin/Products/Create/Fields';
import { IViewProps as IProps } from 'src/components/Admin/Products/Edit/AdminProductsEditPresenter';

export const AdminProductsEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  error,
  intl,
  validate,
  productTypes,
  preloadingError,
  isUpdating,
  featureValues,
  initialValues,
  LoadMoreProductTypes,
  productTypesLoading,
}: IProps & { intl: IntlShape }) => (
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
