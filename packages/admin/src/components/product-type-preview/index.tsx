import React from 'react';
import { useIntl } from 'react-intl';

import { ProductTypePagePresenter, Props as PresenterProps } from '@eye8/client/pages/product-type/presenter';
import { ProductTypePageView } from '@eye8/client/pages/product-type/view';
import { useDI } from '@eye8/di';

export interface Props {
  id: number;
  action: PresenterProps['action'];
}

export const ProductTypePreview = ({ id, action }: Props) => {
  const { di } = useDI();

  const intl = useIntl();

  return (
    <ProductTypePagePresenter
      action={action}
      actionText={intl.formatMessage({ id: 'common.choose' })}
      id={id}
      productService={di.service.product}
      productTypeService={di.service.productType}
      View={ProductTypePageView}
    />
  );
};
