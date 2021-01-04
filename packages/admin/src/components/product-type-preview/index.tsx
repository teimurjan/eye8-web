import React from 'react';
import { useIntl } from 'react-intl';

import { ProductTypePagePresenter, IProps as IPresenterProps } from '@eye8/client/pages/product-type/presenter';
import { ProductTypePageView } from '@eye8/client/pages/product-type/view';
import { useDependencies } from '@eye8/di';

export interface IProps {
  id: number;
  action: IPresenterProps['action'];
}

export const ProductTypePreview = ({ id, action }: IProps) => {
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
