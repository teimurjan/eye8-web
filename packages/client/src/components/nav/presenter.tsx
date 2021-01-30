import React from 'react';

import { CategoriesState } from '@eye8/client/state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  categoriesState: CategoriesState;
}

export interface ViewProps {
  categories: CategoriesState['categories'];
}

const NavPresenter = ({ categoriesState, View }: Props) => {
  return <View categories={categoriesState.categories} />;
};

export default NavPresenter;
