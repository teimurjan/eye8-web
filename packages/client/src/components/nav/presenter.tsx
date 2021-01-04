import React from 'react';

import { IContextValue as CategoriesStateContextValue } from '@eye8/client/state/categories';

export interface IProps extends CategoriesStateContextValue {
  View: React.ComponentType<IViewProps>;
}

export interface IViewProps {
  categories: CategoriesStateContextValue['categoriesState']['categories'];
}

export const NavPresenter = ({ categoriesState, View }: IProps) => {
  return <View categories={categoriesState.categories} />;
};
