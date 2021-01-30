import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { FeatureTypeListRawIntlResponseItem } from '@eye8/api/feature-type';
import { FeatureTypeService } from '@eye8/service/feature-type';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminFeatureTypesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: FeatureTypeService;
  featureTypeId: number;
  history: History;
  adminFeatureTypesState: AdminFeatureTypesState;
}

export interface ViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string } }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
}

export const FEATURE_TYPE_NAME_FIELD_KEY = 'name';

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

export const AdminFeatureTypesEditPresenter: React.FC<Props> = ({
  View,
  history,
  service,
  adminFeatureTypesState: { set: setFeatureTypeToState },
  featureTypeId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [featureType, setFeatureType] = React.useState<FeatureTypeListRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const featureType = await service.getOneRawIntl(featureTypeId);
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
  }, [featureTypeId, service]);

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);
  const edit: ViewProps['edit'] = async (values) => {
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
      const featureType = await service.edit(featureTypeId, formattedValues);
      setFeatureTypeToState(featureType);
      setUpdating(false);
      close();
    } catch (e) {
      setError('errors.common');
      setUpdating(false);
    }
  };

  const initialValues = React.useMemo(() => {
    return availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: (featureType || { name: '' }).name[locale],
      }),
      {},
    );
  }, [featureType]);

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      preloadingError={preloadingError}
      isUpdating={isUpdating}
      isLoading={isLoading}
      initialValues={initialValues}
      close={close}
      validate={validator.validate}
    />
  );
};
