import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminPromoCodesCreateContainer } from '@eye8/admin/pages/promo-codes/create/container';
import { AdminPromoCodesDeleteContainer } from '@eye8/admin/pages/promo-codes/delete/container';
import { AdminPromoCodesEditContainer } from '@eye8/admin/pages/promo-codes/edit/container';
import { AdminPromoCodesListContainer } from '@eye8/admin/pages/promo-codes/list/container';

export const AdminPromoCodes = () => (
  <AdminPage
    ListComponent={AdminPromoCodesListContainer}
    CreateComponent={AdminPromoCodesCreateContainer}
    EditComponent={AdminPromoCodesEditContainer}
    DeleteComponent={AdminPromoCodesDeleteContainer}
  />
);
