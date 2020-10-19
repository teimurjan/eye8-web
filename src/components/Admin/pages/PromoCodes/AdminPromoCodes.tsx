import * as React from 'react';

import { AdminPage } from 'src/components/admin/AdminPage/AdminPage';
import { AdminPromoCodesCreateContainer } from 'src/components/admin/pages/PromoCodes/Create/AdminPromoCodesCreateContainer';
import { AdminPromoCodesDeleteContainer } from 'src/components/admin/pages/PromoCodes/Delete/AdminPromoCodeDeleteContainer';
import { AdminPromoCodesEditContainer } from 'src/components/admin/pages/PromoCodes/Edit/AdminPromoCodesEditContainer';
import { AdminPromoCodesListContainer } from 'src/components/admin/pages/PromoCodes/List/AdminPromoCodesListContainer';

export const AdminPromoCodes = () => (
  <AdminPage
    ListComponent={AdminPromoCodesListContainer}
    CreateComponent={AdminPromoCodesCreateContainer}
    EditComponent={AdminPromoCodesEditContainer}
    DeleteComponent={AdminPromoCodesDeleteContainer}
  />
);
