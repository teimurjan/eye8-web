import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreatePresenter';
import { IntlField } from 'src/components/Admin/IntlField';
import { ModalForm } from 'src/components/Admin/ModalForm';

const Fields = injectIntl(({ intl }: { intl: IntlShape }) => (
  <IntlField
    key_={FEATURE_TYPE_NAME_FIELD_KEY}
    label={intl.formatMessage({
      id: 'AdminFeatureTypes.nameInput.label',
    })}
    placeholder={intl.formatMessage({
      id: 'AdminFeatureTypes.nameInput.placeholder',
    })}
  />
));

export const AdminFeatureTypesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  validate,
}: IProps & { intl: IntlShape }) => (
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
