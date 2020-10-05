import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { ICharacteristicListRawIntlResponseItem } from 'src/api/CharacteristicAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { ICharacteristicService } from 'src/services/CharacteristicService';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/AdminCharacteristicsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICharacteristicService;
  characteristicId: number;
  history: History;
  adminCharacteristicsState: AdminCharacteristicsStateContextValue['state'];
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

export const CHARACTERISTIC_NAME_FIELD_KEY = 'name';

export const AdminCharacteristicsEditPresenter: React.FC<IProps> = ({
  intlState: { availableLocales },
  View,
  history,
  service,
  adminCharacteristicsState: { set: setCharacteristicToState },
  characteristicId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [characteristic, setCharacteristic] = React.useState<ICharacteristicListRawIntlResponseItem | undefined>(
    undefined,
  );
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const characteristic = await service.getOneRawIntl(characteristicId);
        if (characteristic) {
          setCharacteristic(characteristic);
        } else {
          setPreloadingError('AdminCharacteristics.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
  }, [characteristicId, service]);

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
  const edit: IViewProps['edit'] = async (values) => {
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
      const characteristic = await service.edit(characteristicId, formattedValues);
      setCharacteristicToState(characteristic);
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
        [getFieldName(CHARACTERISTIC_NAME_FIELD_KEY, locale)]: (characteristic || { name: '' }).name[locale.id],
      }),
      {},
    );
  }, [availableLocales, characteristic]);

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
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};
