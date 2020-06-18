import * as React from 'react';

import { ProductSelectPresenter, IProps as IPresenterProps } from 'src/components/common-ui/ProductSelect/ProductSelectPresenter';
import { ProductSelectView } from 'src/components/common-ui/ProductSelect/ProductSelectView';
import { useDependencies } from 'src/DI/DI';

interface IProps {
  onChange: IPresenterProps['onChange'];
  placeholder?: string;
  className?: string;
}

export const ProductSelectContainer = ({ onChange, placeholder, className }: IProps) => {
  const { dependencies } = useDependencies();

  return (
    <ProductSelectPresenter
      className={className}
      onChange={onChange}
      View={ProductSelectView}
      searchService={dependencies.services.search}
      placeholder={placeholder}
    />
  );
};
