import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { AdminPromoCodesCreateContainer } from 'src/components/Admin/PromoCodes/Create/AdminPromoCodesCreateContainer';
import { AdminPromoCodesDeleteContainer } from 'src/components/Admin/PromoCodes/Delete/AdminPromoCodeDeleteContainer';
import { AdminPromoCodesEditContainer } from 'src/components/Admin/PromoCodes/Edit/AdminPromoCodesEditContainer';
import { AdminPromoCodesListContainer } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListContainer';

export const AdminPromoCodes = ({ match }: RouteComponentProps) => (
  <>
    <AdminPromoCodesListContainer />
    <Route path={`${match.path}/new`} component={AdminPromoCodesCreateContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminPromoCodesEditContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminPromoCodesDeleteContainer} />
  </>
);
