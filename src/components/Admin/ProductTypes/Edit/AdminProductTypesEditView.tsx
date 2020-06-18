import * as React from 'react';
import { IntlShape } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
} from 'src/components/Admin/ProductTypes/Create/AdminProductTypesCreatePresenter';
import { Fields } from 'src/components/Admin/ProductTypes/Create/Fields';
import { IViewProps as IProps } from 'src/components/Admin/ProductTypes/Edit/AdminProductTypesEditPresenter';

export const AdminProductTypesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  intl,
  availableLocales,
  validate,
  categories,
  preloadingError,
  initialValues,
  featureTypes,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminProductTypesEditForm"
    isOpen={isOpen}
    onSubmit={edit}
    onClose={close}
    isPreloading={isLoading}
    isLoading={isUpdating}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminProductTypes.edit.title' })}
    fields={
      <Fields
        availableLocales={availableLocales}
        categories={categories}
        featureTypes={featureTypes}
        nameFieldKey={PRODUCT_TYPE_NAME_FIELD_KEY}
        descriptionFieldKey={PRODUCT_TYPE_DESCRIPTION_FIELD_KEY}
        shortDescriptionFieldKey={PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY}
      />
    }
    validate={validate}
    initialValues={initialValues}
    wide
  />
);
