import { withRouter } from 'next/router';
import React from 'react';

import { NavPresenter } from '@eye8/client/components/nav/presenter';
import { NavView } from '@eye8/client/components/nav/view';
import { useCategoriesState } from '@eye8/client/state/categories';

const NavViewWithRouter = withRouter(NavView);
export const NavContainer = () => {
  const { categoriesState } = useCategoriesState();

  return <NavPresenter View={NavViewWithRouter} categoriesState={categoriesState} />;
};
