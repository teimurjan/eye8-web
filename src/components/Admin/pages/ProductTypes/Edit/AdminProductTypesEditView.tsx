import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/form/ModalForm';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
} from 'src/components/admin/pages/ProductTypes/Create/AdminProductTypesCreatePresenter';
import { Fields } from 'src/components/admin/pages/ProductTypes/Create/Fields';
import { IViewProps as IProps } from 'src/components/admin/pages/ProductTypes/Edit/AdminProductTypesEditPresenter';

export const AdminProductTypesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  validate,
  categories,
  preloadingError,
  initialValues,
  featureTypes,
  characteristicValues,
}: IProps) => {
  const intl = useIntl();

  return (
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
          characteristicValues={characteristicValues}
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
};
