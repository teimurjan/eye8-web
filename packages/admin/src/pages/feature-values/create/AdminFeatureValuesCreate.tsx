import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminFeatureTypesState, useAdminFeatureValuesState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminFeatureValuesFields from '../fields';

const FEATURE_VALUE_VALUE_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_VALUE_VALUE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        feature_type_id: yup.string().required(),
      },
    ),
  ),
);

interface Props {
  close?: () => void;
}

const AdminFeatureValuesCreate = ({ close }: Props) => {
  const intl = useIntl();
  const history = useHistory();

  const {
    di: {
      service: { featureValue: featureValueService },
    },
  } = useDI();
  const {
    entities: featureTypes,
    isListLoading: featureTypesLoading,
    listError,
    get: getFeatureTypes,
  } = useAdminFeatureTypesState();
  const { add: addFeatureValue } = useAdminFeatureValuesState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const onClose = React.useCallback(() => (close ? close : history.push('/admin/featureValues')), [history, close]);

  useEffect(() => {
    getFeatureTypes();
  }, [getFeatureTypes]);

  const create = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === FEATURE_VALUE_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          feature_type_id: values.feature_type_id,
        },
      );

      try {
        const featureValue = await featureValueService.create(formattedValues);
        addFeatureValue(featureValue);
        setCreating(false);
        onClose();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addFeatureValue, onClose, featureValueService],
  );

  return (
    <ModalForm
      isOpen
      formID="adminFeatureValuesCreateForm"
      onSubmit={create}
      onClose={onClose}
      isLoading={isCreating}
      isPreloading={featureTypesLoading}
      preloadingError={listError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminFeatureValues.create.title' })}
      fields={
        <AdminFeatureValuesFields featureTypes={featureTypes} nameFieldKey={FEATURE_VALUE_VALUE_NAME_FIELD_KEY} />
      }
      validate={validator.validate}
    />
  );
};

export default AdminFeatureValuesCreate;
