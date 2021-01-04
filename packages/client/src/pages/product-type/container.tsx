import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

import { ProductTypePagePresenter, IProps as IPresenterProps } from '@eye8/client/pages/product-type/presenter';
import { ProductTypePageView } from '@eye8/client/pages/product-type/view';
import { useDependencies } from '@eye8/di';

interface IProps {
  initialProps?: IPresenterProps['initialProps'];
}

let addToCartTimeoutID: NodeJS.Timeout;
export const ProductTypePageContainer: React.FC<IProps> = ({ initialProps }) => {
  const { dependencies } = useDependencies();
  const router = useRouter();
  const { id } = router.query;
  const intl = useIntl();

  const [showAddedText, setShowAddedText] = React.useState(false);
  const action: IPresenterProps['action'] = React.useCallback(
    (product) => {
      dependencies.storages.cart.add(product);
      setShowAddedText(true);
      addToCartTimeoutID = setTimeout(() => {
        setShowAddedText(false);
      }, 2000);
    },
    [dependencies.storages.cart],
  );

  React.useEffect(
    () => () => {
      clearTimeout(addToCartTimeoutID);
    },
    [],
  );

  return (
    <ProductTypePagePresenter
      action={showAddedText ? undefined : action}
      actionText={intl.formatMessage({ id: showAddedText ? 'common.addedToCart' : 'common.addToCart' })}
      id={parseInt(id as string, 10)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      View={ProductTypePageView}
      initialProps={initialProps}
    />
  );
};
