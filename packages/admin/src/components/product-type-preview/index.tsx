import React from 'react';
import { useIntl } from 'react-intl';

import { ProductTypePresenter, ProductTypePresenterProps, ProductTypeView } from '@eye8/client/pages';
import { useDI } from '@eye8/di';

export interface Props {
  id: number;
  action: ProductTypePresenterProps['action'];
}

const ProductTypePreview = ({ id, action }: Props) => {
  const { di } = useDI();

  const intl = useIntl();

  return (
    <ProductTypePresenter
      action={action}
      actionText={intl.formatMessage({ id: 'common.choose' })}
      id={id}
      productService={di.service.product}
      productTypeService={di.service.productType}
      View={ProductTypeView}
    />
  );
};

export default ProductTypePreview;
