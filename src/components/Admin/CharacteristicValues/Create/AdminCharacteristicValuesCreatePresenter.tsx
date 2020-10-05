import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { ICharacteristicValueService } from 'src/services/CharacteristicValueService';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/AdminCharacteristicsState';
import { ContextValue as AdminCharacteristicValuesStateContextValue } from 'src/state/AdminCharacteristicValuesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICharacteristicValueService;
  close: () => void;
  adminCharacteristicsState: AdminCharacteristicsStateContextValue['state'];
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; characteristic_id: string }) => void;
  isCreating: boolean;
  isLoading: boolean;
  error: string | undefined;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'];
  validate?: (values: object) => object | Promise<object>;
}

export const CHARACTERISTIC_VALUE_NAME_FIELD_KEY = 'name';

export const AdminCharacteristicValuesCreatePresenter: React.FC<IProps> = ({
  intlState: { availableLocales },
  adminCharacteristicsState: {
    get: getCharacteristics,
    isListLoading: characteristicsLoading,
    entities: characteristics,
    hasListLoaded: isDataLoaded,
  },
  adminCharacteristicValuesState: { add: addCharacteristicValue },
  View,
  service,
  close,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  React.useEffect(() => {
    if (!isDataLoaded) {
      getCharacteristics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(CHARACTERISTIC_VALUE_NAME_FIELD_KEY, locale)]: yup
                .string()
                .required('common.errors.field.empty'),
            }),
            {
              characteristic_id: yup.number().required('common.errors.field.empty'),
            },
          ),
        ),
      ),
    [availableLocales],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: availableLocales.length,
  });

  const create: IViewProps['create'] = React.useCallback(
    async (values) => {
      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === CHARACTERISTIC_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          characteristic_id: parseInt(values.characteristic_id, 10),
          names: {},
        },
      );

      try {
        const featureValue = await service.create(formattedValues);
        addCharacteristicValue(featureValue);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCharacteristicValue, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isCreating={isCreating}
      isLoading={characteristicsLoading}
      close={close}
      availableLocales={availableLocales}
      characteristics={characteristics}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};
