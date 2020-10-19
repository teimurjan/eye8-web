import * as React from 'react';

import { CartPresenter } from 'src/components/client/Cart/CartPresenter';
import { CartView } from 'src/components/client/Cart/CartView';
import { useDependencies } from 'src/DI/DI';
import { useUserState } from 'src/state/UserState';

export const CartContainer = () => {
  const {
    dependencies: {
      storages: { cart: cartStorage },
      services: { product: productService, order: orderService, promoCode: promoCodeService },
    },
  } = useDependencies();
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
