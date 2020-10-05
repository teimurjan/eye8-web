import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { ICharacteristicService } from 'src/services/CharacteristicService';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/AdminCharacteristicsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICharacteristicService;
  history: History;
  adminCharacteristicsState: AdminCharacteristicsStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string } }) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
}

export const CHARACTERISTIC_NAME_FIELD_KEY = 'name';

export const AdminCharacteristicsCreatePresenter: React.FC<IProps> = ({
  intlState: { availableLocales },
  View,
  history,
  service,
  adminCharacteristicsState: { add: addCharacteristic },
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(CHARACTERISTIC_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
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

  const close = React.useCallback(() => history.push('/admin/characteristics'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === CHARACTERISTIC_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
        },
      );

      try {
        const featureType = await service.create(formattedValues);
        addCharacteristic(featureType);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCharacteristic, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isLoading={isCreating}
      close={close}
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};
