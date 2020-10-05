import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { ICharacteristicValueListRawIntlResponseItem } from 'src/api/CharacteristicValueAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { ICharacteristicValueService } from 'src/services/CharacteristicValueService';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/AdminCharacteristicsState';
import { ContextValue as AdminCharacteristicValuesStateContextValue } from 'src/state/AdminCharacteristicValuesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  characteristicValueId: number;
  history: History;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICharacteristicValueService;
  adminCharacteristicsState: AdminCharacteristicsStateContextValue['state'];
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string }; characteristic_id: string }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'];
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
}

export const CHARACTERISTIC_VALUE_NAME_FIELD_KEY = 'name';

export const AdminCharacteristicValuesEditPresenter: React.FC<IProps> = ({
  characteristicValueId,
  intlState: { availableLocales },
  service,
  adminCharacteristicsState: {
    get: getCharacteristics,
    isListLoading: characteristicsLoading,
    entities: characteristics,
    hasListLoaded: isDataLoaded,
  },
  history,
  adminCharacteristicValuesState: { set: setCharacteristicValueToState },
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [characteristicValue, setCharacteristicValue] = React.useState<
    undefined | ICharacteristicValueListRawIntlResponseItem
  >(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const characteristicValue = await service.getOneRawIntl(characteristicValueId);
        if (characteristicValue) {
          if (!isDataLoaded) {
            getCharacteristics();
          }

          setCharacteristicValue(characteristicValue);
        } else {
          setPreloadingError('AdminCharacteristicValues.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
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

  const close = React.useCallback(() => history.push('/admin/characteristicValues'), [history]);

  const edit: IViewProps['edit'] = async (values) => {
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
      const characteristicValue = await service.edit(characteristicValueId, formattedValues);
      setCharacteristicValueToState(characteristicValue);
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
          [getFieldName(CHARACTERISTIC_VALUE_NAME_FIELD_KEY, locale)]: (characteristicValue || { name: '' }).name[
            locale.id
          ],
        }),
        {
          characteristic_id: characteristicValue?.characteristic.id.toString(),
        },
      ),
    [availableLocales, characteristicValue],
  );

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading || characteristicsLoading}
      close={close}
      availableLocales={availableLocales}
      characteristics={characteristics}
      validate={(validator || { validate: undefined }).validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
