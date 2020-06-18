import { withRouter } from 'next/router';
import * as React from 'react';

import { NavPresenter } from 'src/components/Client/Nav/NavPresenter';
import { NavView } from 'src/components/Client/Nav/NavView';
import { useCategoriesState } from 'src/state/CategoriesState';

export const NavContainer = () => {
  const { categoriesState } = useCategoriesState();

  return <NavPresenter View={withRouter(NavView)} categoriesState={categoriesState} />;
};
