import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { FeatureTypeService } from '@eye8/service';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminFeatureTypesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: FeatureTypeService;
  history: History;
  adminFeatureTypesState: AdminFeatureTypesState;
}

export interface ViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string } }) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  validate?: (values: object) => object | Promise<object>;
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

const AdminFeatureTypesCreatePresenter: React.FC<Props> = ({
  View,
  history,
  service,
  adminFeatureTypesState: { add: addFeatureType },
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);

  const create: ViewProps['create'] = React.useCallback(
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

export default AdminFeatureTypesCreatePresenter;
