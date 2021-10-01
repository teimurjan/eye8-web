
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import React from 'react';
import { ExternalLink as ExternalLinkIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Order } from '@eye8/api';
import { Anchor, Tag } from '@eye8/client-ui';
import { IconWrapper, Tooltip } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';
import { getOrderTotalPrice } from '@eye8/shared/utils';

import { PriceText } from '../price';

interface Props {
  order: Order;
  className?: string;
}

const OrderStatus = ({ status }: { status: Order['status'] }) => {
  const intl = useIntl();

  return status === 'rejected' || status === 'completed' ? (
    <Tag
      css={css`
        text-transform: uppercase;
      `}
    >
      {intl.formatMessage({ id: `Order.status.${status}` })}
    </Tag>
  ) : (
    <Tooltip<HTMLSpanElement>
      placement="top"
      delay={300}
      renderTrigger={({ open, close, ref }) => (
        <Tag
          ref={ref}
          onMouseEnter={open}
          onMouseLeave={close}
          css={css`
            text-transform: uppercase;
          `}
        >
          {intl.formatMessage({ id: `Order.status.${status}` })}
        </Tag>
      )}
    >
      {intl.formatMessage({ id: `Order.status.${status}.tooltip` })}
    </Tooltip>
  );
};

const OrderItem: React.FC<Props> = ({ order, className }) => {
  const theme = useTheme() as ClientUITheme;
  const intl = useIntl();
  const total = getOrderTotalPrice(
    order.items,
    order.promo_code_value
      ? {
          amount: order.promo_code_amount,
          discount: order.promo_code_discount ?? 0,
          products: order.promo_code_products,
          value: order.promo_code_value,
        }
      : undefined,
  );

  const orderCreatedOnDate = new Date(order.created_on);

  return (
    <div
      className={className}
      css={css`
        border-bottom: 1px solid ${theme.borderColor};
        padding: 0 10px;

        &:hover {
          background: ${theme.backgroundPrimaryHoverColor};
        }
      `}
    >
      <div
        css={css`
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            text-transform: uppercase;
          `}
        >
          {intl.formatMessage({ id: 'Order.orderPlaced' }, { id: order.id })}
          <br />
          {orderCreatedOnDate.toLocaleDateString(intl.locale)}
        </div>
        <div
          css={css`
            text-transform: uppercase;
            text-align: right;
          `}
        >
          {intl.formatMessage({ id: 'Cart.total' })}:
          <br />
          <b>
            <PriceText price={total} date={orderCreatedOnDate} />
          </b>
        </div>
      </div>
      <div
        css={css`
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        `}
      >
        <div>
          {order.items.map((item) =>
            item.product ? (
              <Anchor
                key={item.id}
                href="products/[slug]"
                as={`/products/${item.product.product_type.slug}`}
                weight={Anchor.Weight.Bold}
                flex
                underline
              >
                {item.product.product_type.name}{' '}
                <IconWrapper
                  css={css`
                    margin-left: 5px;
                  `}
                >
                  <ExternalLinkIcon size={IconSize.Small} />
                </IconWrapper>
              </Anchor>
            ) : null,
          )}
        </div>
        <OrderStatus status={order.status} />
      </div>
    </div>
  );
};

export default OrderItem;
