import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IPromoCodeDetailResponseItem } from 'src/api/PromoCodeAPI';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IPromoCodeService } from 'src/services/PromoCodeService';
import * as promoCodeService from 'src/services/PromoCodeService';
import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/AdminPromoCodesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IPromoCodeService;
  history: History;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: {
    discount: string;
    amount?: string;
    value: string;
    isActive: boolean;
    disableOnUse: boolean;
    products?: IPromoCodeDetailResponseItem['products'];
  }) => void;
  isCreating: boolean;
  error?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    discount: yup.number().required('common.errors.field.empty'),
    amount: yup.number(),
    value: yup
      .string()
      .required('common.errors.field.empty')
      .matches(/^[A-z0-9]*$/, 'common.errors.onlyLowercaseLettersAndNumbers'),
    products: yup.array(),
  }),
);

export const getErrorMessageID = (e: Error) => {
  if (e instanceof promoCodeService.errors.ValueAlreadyExists) {
    return 'AdminPromoCodes.errors.valueAlreadyExists';
  }
  if (e instanceof promoCodeService.errors.PromoCodeHasOrders) {
    return 'AdminPromoCodes.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminPromoCodesCreatePresenter: React.FC<IProps> = ({
  history,
  adminPromoCodesState: { get: getPromoCodes },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/promoCodes'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);
      const formattedValues = {
        value: values.value,
        discount: parseInt(values.discount, 10),
        amount: values.amount ? parseFloat(values.amount) : undefined,
        is_active: values.isActive,
        disable_on_use: values.disableOnUse,
        products: (values.products || []).map((product) => product.id),
      };

      try {
        await service.create(formattedValues);
        getPromoCodes();
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setCreating(false);
      }
    },
    [service, getPromoCodes, close],
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
