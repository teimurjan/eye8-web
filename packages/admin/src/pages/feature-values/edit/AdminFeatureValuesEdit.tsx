import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { FeatureValue } from '@eye8/api';
import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminFeatureValuesState, useAdminFeatureTypesState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminFeatureValuesFields from '../fields';

const FEATURE_VALUE_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_VALUE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        feature_type_id: yup.number().nullable(true),
      },
    ),
  ),
);

const AdminFeatureValuesEdit = () => {
  const history = useHistory();
  const { id: featureValueIdStr } = useParams<{ id: string }>();
  const featureValueId = parseInt(featureValueIdStr, 10);

  const {
    di: {
      service: { featureValue: featureValueService },
    },
  } = useDI();
  const {
    get: getFeatureTypes,
    entities: featureTypes,
    isListLoading: featureTypesLoading,
    listError,
  } = useAdminFeatureTypesState();
  const { set: setFeatureValueToState } = useAdminFeatureValuesState();

  const intl = useIntl();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [featureValue, setFeatureValue] = React.useState<FeatureValue<true> | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        getFeatureTypes();

        const featureValue = await featureValueService.getOneRawIntl(featureValueId);
        if (featureValue) {
          setFeatureValue(featureValue);
        } else {
          setPreloadingError('AdminFeatureValues.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/featureValues'), [history]);

  const edit = React.useCallback(
    async (values) => {
      setUpdating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === FEATURE_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          feature_type_id: parseInt(values.feature_type_id, 10),
        },
      );

      try {
        const featureValue = await featureValueService.edit(featureValueId, formattedValues);
        setFeatureValueToState(featureValue);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [featureValueId, close, featureValueService, setFeatureValueToState],
  );

  const initialValues = React.useMemo(() => {
    if (featureValue) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(FEATURE_VALUE_NAME_FIELD_KEY, locale)]: featureValue.name[locale],
          }),
          {},
        ),
        feature_type_id: featureValue.feature_type.id,
      };
    }

    return {};
  }, [featureValue]);

  return (
    <ModalForm
      isOpen
      formID="adminFeatureValuesEditForm"
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading || featureTypesLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError || listError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminFeatureValues.edit.title' })}
      fields={<AdminFeatureValuesFields featureTypes={featureTypes} nameFieldKey={FEATURE_VALUE_NAME_FIELD_KEY} />}
      validate={validator.validate}
      initialValues={initialValues}
    />
  );
};

export default AdminFeatureValuesEdit;
