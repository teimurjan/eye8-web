import * as React from 'react';
import { useIntl } from 'react-intl';

import { Fields } from 'src/components/Admin/FeatureValues/Create/Fields';
import { IViewProps as IProps } from 'src/components/Admin/FeatureValues/Edit/AdminFeatureValuesEditPresenter';
import { ModalForm } from 'src/components/Admin/ModalForm';

export const AdminFeatureValuesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  initialValues,
  validate,
  preloadingError,
  featureTypes,
}: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminFeatureValuesEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminFeatureValues.edit.title' })}
      fields={<Fields featureTypes={featureTypes} />}
      validate={validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
