import { History } from 'history';
import * as React from 'react';

import { IPromoCodeDetailResponseItem } from 'src/api/PromoCodeAPI';
import { getErrorMessageID } from 'src/components/Admin/PromoCodes/Create/AdminPromoCodesCreatePresenter';
import { useDebounce } from 'src/hooks/useDebounce';
import { IPromoCodeService } from 'src/services/PromoCodeService';
import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/AdminPromoCodesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IPromoCodeService;
  history: History;
  promoCodeId: number;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: {
    isActive: boolean;
    disableOnUse: boolean;
    products?: IPromoCodeDetailResponseItem['products'];
  }) => void;
  isUpdating: boolean;
  isLoading: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  initialValues: object;
}

export const AdminPromoCodesEditPresenter: React.FC<IProps> = ({
  history,
  adminPromoCodesState: { get: getPromoCodes },
  service,
  View,
  promoCodeId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState<IPromoCodeDetailResponseItem | undefined>(undefined);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isLoadingDebounced = useDebounce(isLoading, 500);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const promoCode = await service.getOne(promoCodeId);
        if (promoCode) {
          setPromoCode(promoCode);
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
    async values => {
      setUpdating(true);
      const formattedValues = {
        is_active: values.isActive,
        disable_on_use: values.disableOnUse,
        products: (values.products || []).map(product => product.id),
      };

      try {
        await service.edit(promoCodeId, formattedValues);
        getPromoCodes();
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setUpdating(false);
      }
    },
    [service, getPromoCodes, close, promoCodeId],
  );

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoadingDebounced}
      preloadingError={preloadingError}
      close={close}
      initialValues={
        promoCode
          ? {
              value: promoCode.value,
              discount: promoCode.discount,
              isActive: promoCode.is_active,
              disableOnUse: promoCode.disable_on_use,
              products: promoCode.products,
            }
          : {}
      }
    />
  );
};
