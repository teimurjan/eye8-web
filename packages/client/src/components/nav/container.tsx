import { withRouter } from 'next/router';
import React from 'react';

import { useCategoriesState } from '@eye8/client/state';

import NavPresenter from './presenter';
import NavView from './view';

const NavViewWithRouter = withRouter(NavView);
const NavContainer = () => {
  const { categoriesState } = useCategoriesState();

  return <NavPresenter View={NavViewWithRouter} categoriesState={categoriesState} />;
};

export default NavContainer;
