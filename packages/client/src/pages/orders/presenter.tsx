import { History, Location } from 'history';
import React from 'react';

import { OrderListResponseItem, OrderListResponseMeta } from '@eye8/api/order';
import { OrderService } from '@eye8/service/order';
import { isUserAuthorized } from '@eye8/shared/helpers';
import { AuthorizedUser } from '@eye8/shared/state';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface ViewProps {
  orders: OrderListResponseItem[];
  isLoading?: boolean;
  error?: string;
  currentPage: number;
  pagesCount: number;
  onPageChange: (page: number) => void;
}

interface Props {
  service: OrderService;
  View: React.ComponentType<ViewProps>;
  user: AuthorizedUser;
  history: History;
  location: Location;
}

const OrdersPresenter: React.FC<Props> = ({ service, View, user, history, location }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [ordersData, setOrdersData] = React.useState<{
    entities: { [key: number]: OrderListResponseItem };
    order: number[];
    meta: OrderListResponseMeta;
  }>({
    entities: {},
    order: [],
    meta: {
      count: 0,
      pages_count: 0,
      limit: 0,
      page: 0,
    },
  });
  const [error, setError] = React.useState<undefined | string>(undefined);

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
          setOrdersData({ entities: orders, meta, order: result });
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
      orders={agregateOrderedMapToArray(ordersData.entities, ordersData.order)}
      isLoading={isLoading}
      error={error}
      currentPage={ordersData.meta.page}
      onPageChange={getOrders}
      pagesCount={ordersData.meta.pages_count}
    />
  );
};

export default OrdersPresenter;
