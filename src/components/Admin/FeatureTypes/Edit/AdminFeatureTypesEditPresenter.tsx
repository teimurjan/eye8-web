import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IFeatureTypeService } from 'src/services/FeatureTypeService';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/Admin/AdminFeatureTypesState';
import { availableLocales } from 'src/utils/locale';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureTypeService;
  featureTypeId: number;
  history: History;
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
}

export interface IViewProps {
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

const validator = new schemaValidator.SchemaValidator(
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

export const AdminFeatureTypesEditPresenter: React.FC<IProps> = ({
  View,
  history,
  service,
  adminFeatureTypesState: { set: setFeatureTypeToState },
  featureTypeId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [featureType, setFeatureType] = React.useState<IFeatureTypeListRawIntlResponseItem | undefined>(undefined);
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
  const edit: IViewProps['edit'] = async (values) => {
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
