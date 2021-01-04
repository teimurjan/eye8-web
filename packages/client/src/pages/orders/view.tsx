/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Container } from '@eye8/admin-ui/index';
import { ErrorLayout, LoaderLayout, Pagination, Subtitle, Title } from '@eye8/client-ui';
import { OrderItem } from '@eye8/client/components/order-item';
import { IViewProps as IProps } from '@eye8/client/pages/orders/presenter';

export const OrdersView: React.FC<IProps> = ({ isLoading, orders, error, currentPage, onPageChange, pagesCount }) => {
  const intl = useIntl();

  if (isLoading) {
    return (
      <LoaderLayout
        css={css`
          height: calc(80vh);
        `}
      />
    );
  }

  if (error) {
    return (
      <ErrorLayout
        css={css`
          height: calc(80vh);
        `}
      >
        {intl.formatMessage({ id: error })}
      </ErrorLayout>
    );
  }

  return (
    <Container>
      <Title
        css={css`
          padding-top: 20px;
        `}
        size={3}
      >
        {intl.formatMessage({ id: 'Header.orders' })}
      </Title>
      {orders.length === 0 && <Subtitle size={4}>{intl.formatMessage({ id: 'Orders.empty' })}</Subtitle>}

      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}

      {pagesCount > 1 && (
        <Pagination
          css={css`
            margin-top: 20px;
          `}
          page={currentPage}
          onChange={onPageChange}
          length={pagesCount}
        />
      )}
    </Container>
  );
};
