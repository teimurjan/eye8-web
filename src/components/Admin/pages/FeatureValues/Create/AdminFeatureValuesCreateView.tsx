import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/form/ModalForm';
import { IViewProps as IProps } from 'src/components/admin/pages/FeatureValues/Create/AdminFeatureValuesCreatePresenter';
import { Fields } from 'src/components/admin/pages/FeatureValues/Create/Fields';

export const AdminFeatureValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  featureTypes,
  validate,
}: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminFeatureValuesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminFeatureValues.create.title' })}
      fields={<Fields featureTypes={featureTypes} />}
      validate={validate}
    />
  );
};
