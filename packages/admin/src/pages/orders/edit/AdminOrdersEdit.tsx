import pick from 'lodash/pick';
import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { Order } from '@eye8/api';
import { useDI } from '@eye8/di';
import { PromoCodeNotFoundError } from '@eye8/service';
import { PHONE_REGEX, SchemaValidator } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminOrdersState } from '../../../state';
import AdminOrdersFields from '../fields';

const validator = new SchemaValidator(
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
  if (e instanceof PromoCodeNotFoundError) {
    return 'AdminOrders.errors.promoCodeInvalid';
  }

  return 'errors.common';
};

const AdminOrdersEdit = () => {
  const history = useHistory();
  const { id: orderIdStr } = useParams<{ id: string }>();
  const orderId = parseInt(orderIdStr, 10);

  const {
    di: {
      service: { order: orderService },
    },
  } = useDI();
  const { set: setOrderToState } = useAdminOrdersState();

  const intl = useIntl();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [order, setOrder] = React.useState<Order | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setOrder(await orderService.getOne(orderId));
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, orderService]);

  const close = React.useCallback(() => history.push('/admin/orders'), [history]);

  const edit = React.useCallback(
    async (values) => {
      setUpdating(true);

      const formattedValues = {
        ...values,
        items: values.items.map((item: any) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      try {
        const order = await orderService.edit(orderId, formattedValues);
        setOrderToState(order);
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setUpdating(false);
      }
    },
    [orderService, orderId, setOrderToState, close],
  );

  const initialValues = React.useMemo(() => {
    if (order) {
      return {
        user_name: order.user_name,
        user_phone_number: order.user_phone_number,
        user_address: order.user_address,
        status: order.status,
        items: order.items,
        promo_code: order.promo_code_value,
      };
    }

    return {};
  }, [order]);

  return (
    <ModalForm
      isOpen
      formID="adminOrdersEditForm"
      onSubmit={edit}
      onClose={close}
      isLoading={isUpdating}
      isPreloading={isLoading}
      preloadingError={preloadingError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminOrders.edit.title' })}
      fields={
        <AdminOrdersFields
          {...pick(order, ['promo_code_amount', 'promo_code_discount', 'promo_code_products', 'promo_code_value'])}
        />
      }
      validate={validator.validate}
      initialValues={initialValues}
      wide
    />
  );
};

export default AdminOrdersEdit;
