import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IFeatureValueService } from 'src/services/FeatureValueService';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { ContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { availableLocales } from 'src/utils/locale';

export interface IProps {
  featureValueId: number;
  history: History;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureValueService;
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string }; feature_type_id: string }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => void;
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
}

export const FEATURE_VALUE_NAME_FIELD_KEY = 'name';

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_VALUE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        feature_type_id: yup.number().required('common.errors.field.empty'),
      },
    ),
  ),
);

export const AdminFeatureValuesEditPresenter: React.FC<IProps> = ({
  featureValueId,

  service,
  adminFeatureTypesState: {
    get: getFeatureTypes,
    isListLoading: featureTypesLoading,
    entities: featureTypes,
    hasListLoaded: isDataLoaded,
  },
  history,
  adminFeatureValuesState: { set: setFeatureValueToState },
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [featureValue, setFeatureValue] = React.useState<undefined | IFeatureValueListRawIntlResponseItem>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const featureValue = await service.getOneRawIntl(featureValueId);
        if (featureValue) {
          if (!isDataLoaded) {
            getFeatureTypes();
          }

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

  const edit: IViewProps['edit'] = async (values) => {
    const formattedValues = Object.keys(values).reduce(
      (acc, fieldName) => {
        const { key, locale } = parseFieldName(fieldName);
        if (key === FEATURE_VALUE_NAME_FIELD_KEY) {
          return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
        }

        return acc;
      },
      {
        feature_type_id: parseInt(values.feature_type_id, 10),
        names: {},
      },
    );

    try {
      const featureValue = await service.edit(featureValueId, formattedValues);
      setFeatureValueToState(featureValue);
      setUpdating(false);
      close();
    } catch (e) {
      setError('errors.common');
      setUpdating(false);
    }
  };

  const initialValues = React.useMemo(
    () =>
      availableLocales.reduce(
        (acc, locale) => ({
          ...acc,
          [getFieldName(FEATURE_VALUE_NAME_FIELD_KEY, locale)]: (featureValue || { name: '' }).name[locale],
        }),
        {
          feature_type_id: featureValue?.feature_type.id.toString(),
        },
      ),
    [featureValue],
  );

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading || featureTypesLoading}
      close={close}
      featureTypes={featureTypes}
      validate={validator.validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
