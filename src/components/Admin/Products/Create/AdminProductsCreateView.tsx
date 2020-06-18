import * as React from 'react';
import { IntlShape } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import { IViewProps as IProps } from 'src/components/Admin/Products/Create/AdminProductsCreatePresenter';
import { Fields } from 'src/components/Admin/Products/Create/Fields';

export const AdminProductsCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  validate,
  preloadingError,
  isCreating,
  featureValues,
  productTypes,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminProductsCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminProducts.create.title' })}
    fields={<Fields productTypes={productTypes} featureValues={featureValues} />}
    validate={validate}
    wide
  />
);
