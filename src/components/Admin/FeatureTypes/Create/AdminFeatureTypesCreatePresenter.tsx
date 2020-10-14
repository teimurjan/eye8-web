import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IFeatureTypeService } from 'src/services/FeatureTypeService';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { availableLocales } from 'src/utils/locale';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureTypeService;
  history: History;
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string } }) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  validate?: (values: object) => object | Promise<object>;
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

export const AdminFeatureTypesCreatePresenter: React.FC<IProps> = ({
  View,
  history,
  service,
  adminFeatureTypesState: { add: addFeatureType },
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);

  const create: IViewProps['create'] = React.useCallback(
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
        const featureType = await service.create(formattedValues);
        addFeatureType(featureType);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addFeatureType, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isLoading={isCreating}
      close={close}
      validate={validator.validate}
    />
  );
};
