import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { RateName } from 'src/components/Client/Price/Price';
import * as schemaValidator from 'src/components/SchemaValidator';
import * as rateService from 'src/services/RateService';
import { ContextValue as AdminRatesStateContextValue } from 'src/state/AdminRatesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: rateService.IRateService;
  history: History;
  adminRatesState: AdminRatesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { value: string; name: string }) => void;
  isCreating: boolean;
  error?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    value: yup.number().required('common.errors.field.empty'),
    name: yup
      .string()
      .required('common.errors.field.empty')
      .oneOf([RateName.Primary], 'AdminRates.errors.unallowedName'),
  }),
);

export const getErrorMessageID = (e: Error) => {
  if (e instanceof rateService.errors.LimitExceeded) {
    return 'AdminRates.errors.limitExceeded';
  }

  return 'errors.common';
};

export const AdminRatesCreatePresenter: React.FC<IProps> = ({
  history,
  adminRatesState: { get: getRates },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/rates'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);
      try {
        const formattedValues = { name: values.name.toLowerCase(), value: parseFloat(values.value) };
        await service.create(formattedValues);
        getRates();
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setCreating(false);
      }
    },
    [service, getRates, close],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isCreating={isCreating}
      close={close}
      validate={validator.validate}
    />
  );
};
