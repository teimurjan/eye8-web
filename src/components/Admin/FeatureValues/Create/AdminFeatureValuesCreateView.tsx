import * as React from 'react';
import { IntlShape } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreatePresenter';
import { Fields } from 'src/components/Admin/FeatureValues/Create/Fields';
import { ModalForm } from 'src/components/Admin/ModalForm';

export const AdminFeatureValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  intl,
  availableLocales,
  featureTypes,
  validate,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminFeatureValuesCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminFeatureValues.create.title' })}
    fields={<Fields availableLocales={availableLocales} featureTypes={featureTypes} />}
    validate={validate}
  />
);
