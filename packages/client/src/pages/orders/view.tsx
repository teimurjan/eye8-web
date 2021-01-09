/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Container, ErrorLayout, Pagination, Subtitle, Title } from '@eye8/client-ui';
import { OrderItem } from '@eye8/client/components/order-item';
import { ViewProps as Props } from '@eye8/client/pages/orders/presenter';
import { LoaderLayout } from '@eye8/shared/components';

export const OrdersView: React.FC<Props> = ({ isLoading, orders, error, currentPage, onPageChange, pagesCount }) => {
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
