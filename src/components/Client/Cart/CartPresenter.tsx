import * as React from 'react';
import * as yup from 'yup';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { IPromoCodeDetailResponseItem } from 'src/api/PromoCodeAPI';
import { getErrorMessageID } from 'src/components/Admin/Orders/Edit/AdminOrdersEditPresenter';
import * as schemaValidator from 'src/components/SchemaValidator';
import { getUserPropertySafe } from 'src/helpers/user';
import { useBoolean } from 'src/hooks/useBoolean';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMousetrap } from 'src/hooks/useMousetrap';
import { IOrderService } from 'src/services/OrderService';
import { IProductService } from 'src/services/ProductService';
import { IPromoCodeService } from 'src/services/PromoCodeService';
import { IContextValue as UserStateContextValue } from 'src/state/UserState';
import { ICartStorage } from 'src/storage/CartStorage';
import { agregateOrderedMapToArray } from 'src/utils/agregate';
import { PHONE_REGEX } from 'src/utils/phone';
import { isTrimmed } from 'src/utils/validate';

export interface IProps extends UserStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  productService: IProductService;
  orderService: IOrderService;
  promoCodeService: IPromoCodeService;
  storage: ICartStorage;
}

export interface IViewProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  products: IProductListResponseItem[];
  isLoading: boolean;
  error?: string;
  addMore: (product: IProductListResponseItem) => void;
  remove: (product: IProductListResponseItem) => void;
  getProductCount: (id: number) => number;
  cartItemsCount: number;
  step: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  validator: schemaValidator.ISchemaValidator;
  initialValues: Partial<IFormValues>;
  onSubmit: (values: IFormValues) => Promise<void>;
  promoCode?: IPromoCodeDetailResponseItem;
  onPromoCodeApply: (newPromoCode: string) => void;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    name: yup
      .string()
      .test('isTrimmed', 'common.errors.notTrimmed', isTrimmed)
      .required('common.errors.field.empty'),
    phone: yup
      .string()
      .required('common.errors.field.empty')
      .matches(PHONE_REGEX, 'common.errors.invalidPhone'),
    address: yup
      .string()
      .test('isTrimmed', 'common.errors.notTrimmed', isTrimmed)
      .required('common.errors.field.empty'),
  }),
);

export interface IFormValues {
  name: string;
  phone: string;
  address: string;
}

export const CartPresenter: React.FC<IProps> = ({
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
  const [promoCode, setPromoCode] = React.useState<IPromoCodeDetailResponseItem | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [products, setProducts] = React.useState<{ [key: number]: IProductListResponseItem }>({});
  const [productsOrder, setProductsOrder] = React.useState<number[]>([]);
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
        const ids = storage.getItems().map(item => item.id);
        if (ids.length > 0) {
          const { entities, result } = await productService.getForCart(ids);
          setProducts(entities.products);
          setProductsOrder(result);
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
    (product: IProductListResponseItem) => {
      storage.add(product);
    },
    [storage],
  );

  const remove = React.useCallback(
    (product: IProductListResponseItem) => {
      const newCount = storage.remove(product);
      if (newCount === 0) {
        setProductsOrder(productsOrder.filter(id => id !== product.id));
      }
    },
    [productsOrder, storage],
  );

  const goToNextStep = React.useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const goToPrevStep = React.useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const onSubmit = React.useCallback(
    async ({ name, phone, address }: IFormValues) => {
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

  const onPromoCodeApply: IViewProps['onPromoCodeApply'] = React.useCallback(
    async value => {
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
      products={agregateOrderedMapToArray(products, productsOrder)}
      getProductCount={id => {
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
