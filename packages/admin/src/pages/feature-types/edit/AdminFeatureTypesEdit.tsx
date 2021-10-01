import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { FeatureType } from '@eye8/api';
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

const AdminFeatureTypesEdit = () => {
  const history = useHistory();
  const { id: featureTypeIdStr } = useParams<{ id: string }>();
  const featureTypeId = parseInt(featureTypeIdStr, 10);

  const {
    di: {
      service: { featureType: featureTypeService },
    },
  } = useDI();
  const { set: setFeatureTypeToState } = useAdminFeatureTypesState();

  const intl = useIntl();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [featureType, setFeatureType] = React.useState<FeatureType<true> | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const featureType = await featureTypeService.getOneRawIntl(featureTypeId);
        if (featureType) {
          setFeatureType(featureType);
        } else {
          setPreloadingError('AdminFeatureTypes.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);

  const edit = React.useCallback(
    async (values) => {
      setUpdating(true);

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
        const featureType = await featureTypeService.edit(featureTypeId, formattedValues);
        setFeatureTypeToState(featureType);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [featureTypeId, close, featureTypeService, setFeatureTypeToState],
  );

  const initialValues = React.useMemo(() => {
    if (featureType) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: featureType.name[locale],
          }),
          {},
        ),
      };
    }

    return {};
  }, [featureType]);

  return (
    <ModalForm
      isOpen
      formID="adminFeatureTypesEditForm"
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminFeatureTypes.edit.title' })}
      fields={<AdminFeatureTypesFields nameFieldKey={FEATURE_TYPE_NAME_FIELD_KEY} />}
      validate={validator.validate}
      initialValues={initialValues}
    />
  );
};

export default AdminFeatureTypesEdit;
