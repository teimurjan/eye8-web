import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLazy } from 'src/hooks/useLazy';
import { IFeatureTypeService } from 'src/services/FeatureTypeService';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends AdminFeatureTypesStateContextValue, IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureTypeService;
  featureTypeId: number;
  history: History;
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string } }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
}

export const FEATURE_TYPE_NAME_FIELD_KEY = 'name';

export const AdminFeatureTypesEditPresenter: React.FC<IProps> = ({
  intlState: { availableLocales },
  View,
  history,
  service,
  adminFeatureTypesState: { setFeatureType: setFeatureTypeToState },
  featureTypeId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [featureType, setFeatureType] = React.useState<IFeatureTypeListRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const isLoadingDebounced = useDebounce(isLoading, 500);

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

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
            }),
            {},
          ),
        ),
      ),
    [availableLocales],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: availableLocales.length,
  });

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);
  const edit: IViewProps['edit'] = async values => {
    const formattedValues = Object.keys(values).reduce(
      (acc, fieldName) => {
        const { key, id } = parseFieldName(fieldName);
        if (key === FEATURE_TYPE_NAME_FIELD_KEY) {
          return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
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
        [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: (featureType || { name: '' }).name[locale.id],
      }),
      {},
    );
  }, [availableLocales, featureType]);

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      preloadingError={preloadingError}
      isUpdating={isUpdating}
      isLoading={isLoadingDebounced}
      initialValues={initialValues}
      close={close}
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};
