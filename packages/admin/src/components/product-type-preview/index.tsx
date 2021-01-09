import React from 'react';
import { useIntl } from 'react-intl';

import { ProductTypePagePresenter, Props as PresenterProps } from '@eye8/client/pages/product-type/presenter';
import { ProductTypePageView } from '@eye8/client/pages/product-type/view';
import { useDependencies } from '@eye8/di';

export interface Props {
  id: number;
  action: PresenterProps['action'];
}

export const ProductTypePreview = ({ id, action }: Props) => {
  const { dependencies } = useDependencies();

  const intl = useIntl();

  return (
    <ProductTypePagePresenter
      action={action}
      actionText={intl.formatMessage({ id: 'common.choose' })}
      id={id}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      View={ProductTypePageView}
    />
  );
};
