import { History } from 'history';
import React from 'react';

import { useAdminPromoCodesFilters } from '@eye8/admin/hooks/use-admin-promo-codes-filters';
import { getErrorMessageID } from '@eye8/admin/pages/promo-codes/create/presenter';
import { ContextValue as AdminPromoCodesStateContextValue } from '@eye8/admin/state/promo-codes';
import { IProductListResponseItem } from '@eye8/api/product';
import { IPromoCodeListResponseItem } from '@eye8/api/promo-code';
import { IProductService } from '@eye8/service/product';
import { IPromoCodeService } from '@eye8/service/promo-code';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: IPromoCodeService;
  productService: IProductService;
  history: History;
  promoCodeId: number;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { isActive: boolean; disableOnUse: boolean; products: IProductListResponseItem[] }) => void;
  isUpdating: boolean;
  isLoading: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  initialValues: object;
}

export const AdminPromoCodesEditPresenter: React.FC<IProps> = ({
  history,
  adminPromoCodesState: { set: setPromoCodeToState },
  service,
  View,
  promoCodeId,
  productService,
}) => {
  const {
    filters: { deleted },
  } = useAdminPromoCodesFilters();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState<IPromoCodeListResponseItem | undefined>(undefined);
  const [productsData, setProductsData] = React.useState<{
    entities: { [key: string]: IProductListResponseItem };
    order: number[];
  }>({ entities: {}, order: [] });
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const promoCode = await service.getOne(promoCodeId, { deleted });
        if (promoCode) {
          setPromoCode(promoCode);

          if (promoCode.products && promoCode.products.length > 0) {
            const { entities, result } = await productService.getSome(promoCode.products);
            setProductsData({ entities: entities.products, order: result });
          }
        } else {
          setPreloadingError('AdminPromoCodes.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/promoCodes'), [history]);

  const edit: IViewProps['edit'] = React.useCallback(
    async (values) => {
      setUpdating(true);
      console.log(values);
      const formattedValues = {
        is_active: values.isActive,
        disable_on_use: values.disableOnUse,
        products: values.products.map((product) => product.id),
      };

      try {
        const promoCode = await service.edit(promoCodeId, formattedValues);
        setPromoCodeToState(promoCode);
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setUpdating(false);
      }
    },
    [service, setPromoCodeToState, close, promoCodeId],
  );

  console.log(promoCode);
  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading}
      preloadingError={preloadingError}
      close={close}
      initialValues={
        promoCode
          ? {
              value: promoCode.value,
              discount: promoCode.discount,
              isActive: promoCode.is_active,
              disableOnUse: promoCode.disable_on_use,
              products: agregateOrderedMapToArray(productsData.entities, productsData.order),
            }
          : {}
      }
    />
  );
};
