import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '@eye8/admin/components/modal-form';
import { Fields } from '@eye8/admin/pages/product-types/create/fields';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
  IViewProps as IProps,
} from '@eye8/admin/pages/product-types/create/presenter';

export const AdminProductTypesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  validate,
  categories,
  preloadingError,
  isCreating,
  featureTypes,
  onChange,
  initialValues,
  characteristicValues,
}: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminProductTypesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={isLoading}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminProductTypes.create.title' })}
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
      onChange={onChange}
      validate={validate}
      initialValues={initialValues}
      wide
    />
  );
};
