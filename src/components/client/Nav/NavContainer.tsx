import { withRouter } from 'next/router';
import * as React from 'react';

import { NavPresenter } from 'src/components/client/Nav/NavPresenter';
import { NavView } from 'src/components/client/Nav/NavView';
import { useCategoriesState } from 'src/state/CategoriesState';

const NavViewWithRouter = withRouter(NavView);
export const NavContainer = () => {
  const { categoriesState } = useCategoriesState();

  return <NavPresenter View={NavViewWithRouter} categoriesState={categoriesState} />;
};