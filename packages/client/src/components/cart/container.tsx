import React from 'react';

import { CartPresenter } from '@eye8/client/components/cart/presenter';
import { CartView } from '@eye8/client/components/cart/view';
import { useDI } from '@eye8/di';
import { useUserState } from '@eye8/shared/state/user';

export const CartContainer = () => {
  const {
    di: {
      storage: { cart: cartStorage },
      service: { product: productService, order: orderService, promoCode: promoCodeService },
    },
  } = useDI();
  const { userState } = useUserState();

  return (
    <CartPresenter
      userState={userState}
      storage={cartStorage}
      productService={productService}
      orderService={orderService}
      promoCodeService={promoCodeService}
      View={CartView}
    />
  );
};
