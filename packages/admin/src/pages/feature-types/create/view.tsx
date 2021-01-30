import React from 'react';
import { useIntl } from 'react-intl';

import { FEATURE_TYPE_NAME_FIELD_KEY, ViewProps as Props } from '@eye8/admin/pages/feature-types/create/presenter';

import { IntlField } from '../../../components';
import { ModalForm } from '../../../components';

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

export const AdminFeatureTypesCreateView = ({ isOpen, create, close, isLoading, error, validate }: Props) => {
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
