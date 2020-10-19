import * as React from 'react';

import { IContextValue as CategoriesStateContextValue } from 'src/state/CategoriesState';

export interface IProps extends CategoriesStateContextValue {
  View: React.ComponentType<IViewProps>;
}

export interface IViewProps {
  categories: CategoriesStateContextValue['categoriesState']['categories'];
}

export const NavPresenter = ({ categoriesState, View }: IProps) => {
  return <View categories={categoriesState.categories} />;
};
