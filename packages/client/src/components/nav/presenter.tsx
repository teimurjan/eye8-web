import React from 'react';

import { CategoriesStateContextValue } from '@eye8/client/state';

export interface Props extends CategoriesStateContextValue {
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  categories: CategoriesStateContextValue['categoriesState']['categories'];
}

const NavPresenter = ({ categoriesState, View }: Props) => {
  return <View categories={categoriesState.categories} />;
};

export default NavPresenter;
