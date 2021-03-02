import reject from 'lodash/reject';
import React from 'react';
import * as yup from 'yup';

import { Product, PromoCode } from '@eye8/api';
import { OrderService, ProductService, PromoCodeService, PromoCodeNotFoundError } from '@eye8/service';
import { getUserPropertySafe } from '@eye8/shared/helpers';
import { useBoolean, useForceUpdate, useLazyInitialization, useMousetrap } from '@eye8/shared/hooks';
import { UserState } from '@eye8/shared/state';
import { agregateOrderedMapToArray, SchemaValidator, isTrimmed, PHONE_REGEX } from '@eye8/shared/utils';
import { CartStorage } from '@eye8/storage/cart';

export const getErrorMessageID = (e: Error) => {
  if (e instanceof PromoCodeNotFoundError) {
    return 'AdminOrders.errors.promoCodeInvalid';
  }

  return 'errors.common';
};

export interface Props {
  View: React.ComponentType<ViewProps>;
  productService: ProductService;
  orderService: OrderService;
  promoCodeService: PromoCodeService;
  storage: CartStorage;
  userState: UserState;
}

export interface ViewProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  products: Product[];
  isLoading: boolean;
  error?: string;
  addMore: (product: Product) => void;
  remove: (product: Product) => void;
  getProductCount: (id: number) => number;
  cartItemsCount: number;
  step: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  validator: SchemaValidator;
  initialValues: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  promoCode?: PromoCode;
  onPromoCodeApply: (newPromoCode: string) => void;
}

const validator = new SchemaValidator(
  yup.object().shape({
    name: yup.string().test('isTrimmed', 'common.errors.notTrimmed', isTrimmed).required('common.errors.field.empty'),
    phone: yup.string().required('common.errors.field.empty').matches(PHONE_REGEX, 'common.errors.invalidPhone'),
    address: yup
      .string()
      .test('isTrimmed', 'common.errors.notTrimmed', isTrimmed)
      .required('common.errors.field.empty'),
  }),
);

export interface FormValues {
  name: string;
  phone: string;
  address: string;
}

const CartPresenter: React.FC<Props> = ({
  View,
  productService,
  orderService,
  storage,
  promoCodeService,
  userState: { user },
}) => {
  const { value: isOpen, setPositive: open, setNegative: close, toggle } = useBoolean();

  const [step, setStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(true);
  const [promoCode, setPromoCode] = React.useState<PromoCode | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [data, setData] = React.useState<{
    entities: { [key: number]: Product };
    order: number[];
  }>({ entities: {}, order: [] });
  const { update } = useForceUpdate();

  useMousetrap('shift+c', open);

  React.useEffect(() => storage.addChangeListener(() => update()), [update, storage]);

  React.useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const items = storage.getItems();
        const ids = items.map((item) => item.id);
        if (ids.length > 0) {
          const { entities, result } = await productService.getForCart(ids);
          setData({ entities: entities.products, order: result });
          storage.setItems(items.filter((item) => result.includes(item.id)));
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addMore = React.useCallback(
    (product: Product) => {
      storage.add(product);
    },
    [storage],
  );

  const remove = React.useCallback(
    (product: Product) => {
      const newCount = storage.remove(product);
      if (newCount === 0) {
        setData({
          entities: reject(data.entities, (entity) => entity.id !== product.id),
          order: data.order.filter((id) => id !== product.id),
        });
      }
    },
    [data, storage],
  );

  const goToNextStep = React.useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const goToPrevStep = React.useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const onSubmit = React.useCallback(
    async ({ name, phone, address }: FormValues) => {
      const cartItems = storage.getItems();
      const itemsToSubmit = cartItems.map(({ id, count }) => ({
        product_id: id,
        quantity: count || 0,
      }));

      try {
        setError(undefined);
        await orderService.create({
          items: itemsToSubmit,
          user_name: name,
          user_phone_number: phone,
          user_address: address,
          promo_code: promoCode?.value,
        });
        goToNextStep();
        storage.clear();
      } catch (e) {
        setError(getErrorMessageID(e));
      }
    },
    [goToNextStep, orderService, storage, promoCode],
  );

  const totalCartItemsCount = storage.getItems().reduce((acc, item) => acc + (item.count || 0), 0);
  const { value: lazyTotalCartItemsCount } = useLazyInitialization(totalCartItemsCount, 0);

  const onPromoCodeApply: ViewProps['onPromoCodeApply'] = React.useCallback(
    async (value) => {
      setError(undefined);
      if (value.length > 0) {
        const promoCode = await promoCodeService.getByValue(value);
        if (promoCode) {
          setPromoCode(promoCode);
        } else {
          setError('Cart.invalidPromoCode');
        }
      }
    },
    [promoCodeService],
  );

  return (
    <View
      isOpen={isOpen}
      open={open}
      close={close}
      toggle={toggle}
      products={agregateOrderedMapToArray(data.entities, data.order)}
      getProductCount={(id) => {
        const storageItem = storage.getItem(id);
        return storageItem && storageItem.count ? storageItem.count : 0;
      }}
      error={error}
      isLoading={isLoading}
      addMore={addMore}
      remove={remove}
      step={step}
      goToNextStep={goToNextStep}
      goToPrevStep={goToPrevStep}
      validator={validator}
      initialValues={{
        name: getUserPropertySafe(user, 'name', '') as string,
      }}
      cartItemsCount={lazyTotalCartItemsCount}
      onSubmit={onSubmit}
      promoCode={promoCode}
      onPromoCodeApply={onPromoCodeApply}
    />
  );
};

export default CartPresenter;
