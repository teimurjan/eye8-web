import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/product-types/create/fields';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
} from '@eye8/admin/pages/product-types/create/presenter';
import { ViewProps as Props } from '@eye8/admin/pages/product-types/edit/presenter';

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
}: Props) => {
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
