import * as React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from 'src/components/admin/IntlField';
import { ModalForm } from 'src/components/admin/ModalForm';
import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/admin/pages/FeatureTypes/Create/AdminFeatureTypesCreatePresenter';

const Fields = () => {
  const intl = useIntl();
  return (
    <IntlField
      key_={FEATURE_TYPE_NAME_FIELD_KEY}
      label={intl.formatMessage({
        id: 'AdminFeatureTypes.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminFeatureTypes.nameInput.placeholder',
      })}
    />
  );
};

export const AdminFeatureTypesCreateView = ({ isOpen, create, close, isLoading, error, validate }: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminFeatureTypesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminFeatureTypes.create.title' })}
      fields={<Fields />}
      validate={validate}
    />
  );
};
