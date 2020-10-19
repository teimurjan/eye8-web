import { History } from 'history';
import pick from 'lodash/pick';
import * as React from 'react';
import * as yup from 'yup';

import { IOrderListResponseItem } from 'src/api/OrderAPI';
import { IOrderService } from 'src/services/OrderService';
import * as orderService from 'src/services/OrderService';
import { ContextValue as AdminOrdersStateContextValue } from 'src/state/Admin/AdminOrdersState';
import { PHONE_REGEX } from 'src/utils/phone';
import * as schemaValidator from 'src/utils/schemaValidator';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: IOrderService;
  history: History;
  orderId: number;
  adminOrdersState: AdminOrdersStateContextValue['state'];
}

export interface IViewProps
  extends Pick<
    IOrderListResponseItem,
    'promo_code_amount' | 'promo_code_discount' | 'promo_code_products' | 'promo_code_value'
  > {
  isOpen: boolean;
  edit: (values: {
    user_name: string;
    user_phone_number: string;
    user_address: string;
    items: Array<{
      id: number;
      product: { id: number };
      quantity: number;
    }>;
    status: string;
  }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    user_name: yup.string().required('common.errors.field.empty'),
    user_phone_number: yup
      .string()
      .required('common.errors.field.empty')
      .matches(PHONE_REGEX, 'common.errors.invalidPhone'),
    user_address: yup.string().required('common.errors.field.empty'),
    status: yup.string().required('common.errors.field.empty'),
    items: yup.array().min(1, 'common.errors.field.atLeast1'),
  }),
);

export const getErrorMessageID = (e: Error) => {
  if (e instanceof orderService.errors.PromoCodeInvalid) {
    return 'AdminOrders.errors.promoCodeInvalid';
  }

  return 'errors.common';
};

export const AdminOrdersEditPresenter: React.FC<IProps> = ({
  history,
  adminOrdersState: { set: setOrderToState },
  service,
  View,
  orderId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [order, setOrder] = React.useState<IOrderListResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setOrder(await service.getOne(orderId));
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, service]);

  const close = React.useCallback(() => history.push('/admin/orders'), [history]);

  const edit: IViewProps['edit'] = React.useCallback(
    async (values) => {
      setUpdating(true);

      const formattedValues = {
        ...values,
        items: values.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      try {
        const order = await service.edit(orderId, formattedValues);
        setOrderToState(order);
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setUpdating(false);
      }
    },
    [service, orderId, setOrderToState, close],
  );

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isLoading={isLoading}
      isUpdating={isUpdating}
      close={close}
      validate={validator.validate}
      preloadingError={preloadingError}
      initialValues={
        order
          ? {
              user_name: order.user_name,
              user_phone_number: order.user_phone_number,
              user_address: order.user_address,
              status: order.status,
              items: order.items,
              promo_code: order.promo_code_value,
            }
          : {}
      }
      {...pick(order, ['promo_code_amount', 'promo_code_discount', 'promo_code_products', 'promo_code_value'])}
    />
  );
};
