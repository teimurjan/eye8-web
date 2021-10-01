import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminFeatureTypesState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminFeatureTypesFields from '../fields';

const FEATURE_TYPE_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {},
    ),
  ),
);

const AdminFeatureTypesCreate = () => {
  const intl = useIntl();
  const history = useHistory();

  const {
    di: {
      service: { featureType: featureTypeService },
    },
  } = useDI();
  const { add: addFeatureType } = useAdminFeatureTypesState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);

  const create = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === FEATURE_TYPE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
        },
      );

      try {
        const featureType = await featureTypeService.create(formattedValues);
        addFeatureType(featureType);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addFeatureType, close, featureTypeService],
  );

  return (
    <ModalForm
      isOpen
      formID="adminFeatureTypesCreateForm"
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminFeatureTypes.create.title' })}
      fields={<AdminFeatureTypesFields nameFieldKey={FEATURE_TYPE_NAME_FIELD_KEY} />}
      validate={validator.validate}
    />
  );
};

export default AdminFeatureTypesCreate;
