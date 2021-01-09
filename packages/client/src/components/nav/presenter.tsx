import React from 'react';

import { ContextValue as CategoriesStateContextValue } from '@eye8/client/state/categories';

export interface Props extends CategoriesStateContextValue {
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  categories: CategoriesStateContextValue['categoriesState']['categories'];
}

export const NavPresenter = ({ categoriesState, View }: Props) => {
  return <View categories={categoriesState.categories} />;
};
