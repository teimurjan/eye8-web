import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { ContextValue as AdminPromoCodesStateContextValue } from '@eye8/admin/state/promo-codes';
import { IProductListResponseItem } from '@eye8/api/product';
import { IPromoCodeService, PromoCodeValueAlreadyExistsError, PromoCodeHasOrdersError } from '@eye8/service/promo-code';
import { SchemaValidator } from '@eye8/shared/utils';

export interface IProps {
  View: React.ComponentType<IViewProps>;
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
    products: IProductListResponseItem[];
  }) => void;
  isCreating: boolean;
  error?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
}

const validator = new SchemaValidator(
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
  if (e instanceof PromoCodeValueAlreadyExistsError) {
    return 'AdminPromoCodes.errors.valueAlreadyExists';
  }
  if (e instanceof PromoCodeHasOrdersError) {
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
        products: values.products.map((product) => product.id),
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
      initialValues={{ products: [] }}
    />
  );
};