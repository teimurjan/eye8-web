import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

import { useDI } from '@eye8/di';

import ProductTypePagePresenter, { Props as PresenterProps } from './presenter';
import ProductTypePageView from './view';

interface Props {
  initialProps?: PresenterProps['initialProps'];
}

let addToCartTimeoutID: NodeJS.Timeout;
const ProductTypePageContainer: React.FC<Props> = ({ initialProps }) => {
  const { di } = useDI();
  const router = useRouter();
  const { id } = router.query;
  const intl = useIntl();

  const [showAddedText, setShowAddedText] = React.useState(false);
  const action: PresenterProps['action'] = React.useCallback(
    (product) => {
      di.storage.cart.add(product);
      setShowAddedText(true);
      addToCartTimeoutID = setTimeout(() => {
        setShowAddedText(false);
      }, 2000);
    },
    [di.storage.cart],
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
      productService={di.service.product}
      productTypeService={di.service.productType}
      View={ProductTypePageView}
      initialProps={initialProps}
    />
  );
};

export default ProductTypePageContainer;
