import { History, Location } from 'history';
import React from 'react';

import { IOrderDetailResponseItem, IOrderListResponseMeta, IOrderForUserResponseItem } from 'src/api/OrderAPI';
import { isUserAuthorized } from 'src/helpers/user';
import { IOrderService } from 'src/services/OrderService';
import { AuthorizedUser } from 'src/state/UserState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IViewProps {
  orders: IOrderDetailResponseItem[];
  isLoading?: boolean;
  error?: string;
  currentPage: number;
  pagesCount: number;
  onPageChange: (page: number) => void;
}

interface IProps {
  service: IOrderService;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  user: AuthorizedUser;
  history: History;
  location: Location;
}

export const OrdersPresenter: React.FC<IProps> = ({ service, View, user, history, location }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<{ [key: string]: IOrderForUserResponseItem }>({});
  const [ordersOrder, setOrdersOrder] = React.useState<number[]>([]);
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [ordersMeta, setOrdersMeta] = React.useState<IOrderListResponseMeta>({
    count: 0,
    pages_count: 0,
    limit: 0,
    page: 0,
  });

  const getOrders = React.useCallback(
    (page: number) => {
      (async () => {
        try {
          setLoading(true);
          const {
            entities: { orders },
            result,
            meta,
          } = await service.getForUser(user.user_id, page);
          setOrders(orders);
          setOrdersOrder(result);
          setOrdersMeta(meta);
          history.replace({ pathname: `${location.pathname}`, search: `?page=${page}` });
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      })();
    },
    [service, user.user_id, history, location],
  );

  React.useEffect(() => {
    if (isUserAuthorized(user)) {
      const queryParams = new URLSearchParams(location.search);
      const pageStr = queryParams.get('page');
      const page = pageStr ? parseInt(pageStr, 10) : 1;
      getOrders(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!user]);

  return (
    <View
      orders={agregateOrderedMapToArray(orders, ordersOrder)}
      isLoading={isLoading}
      error={error}
      currentPage={ordersMeta.page}
      onPageChange={getOrders}
      pagesCount={ordersMeta.pages_count}
    />
  );
};
