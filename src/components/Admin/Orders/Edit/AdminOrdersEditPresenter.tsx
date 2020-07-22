import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IOrderDetailResponseItem } from 'src/api/OrderAPI';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IOrderService } from 'src/services/OrderService';
import * as orderService from 'src/services/OrderService';
import { ContextValue as AdminOrdersStateContextValue } from 'src/state/AdminOrdersState';
import { PHONE_REGEX } from 'src/utils/phone';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IOrderService;
  history: History;
  orderId: number;
  adminOrdersState: AdminOrdersStateContextValue['state'];
}

export interface IViewProps {
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
  promoCode?: IOrderDetailResponseItem['promo_code'];
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
  const [order, setOrder] = React.useState<IOrderDetailResponseItem | undefined>(undefined);
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
    async values => {
      setUpdating(true);

      const formattedValues = {
        ...values,
        items: values.items.map(item => ({
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
      promoCode={order ? order.promo_code : undefined}
      initialValues={
        order
          ? {
              user_name: order.user_name,
              user_phone_number: order.user_phone_number,
              user_address: order.user_address,
              status: order.status,
              items: order.items,
              promo_code: order.promo_code ? order.promo_code.value : '',
            }
          : {}
      }
    />
  );
};
