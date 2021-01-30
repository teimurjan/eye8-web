import React from 'react';

import { useDI } from '@eye8/di';
import { useUserState } from '@eye8/shared/state';

import CartPresenter from './presenter';
import CartView from './view';

const CartContainer = () => {
  const {
    di: {
      storage: { cart: cartStorage },
      service: { product: productService, order: orderService, promoCode: promoCodeService },
    },
  } = useDI();
  const userState = useUserState();

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

export default CartContainer;
