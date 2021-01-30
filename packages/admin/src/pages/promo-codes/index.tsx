import React from 'react';

import { AdminPromoCodesCreateContainer } from '@eye8/admin/pages/promo-codes/create/container';
import { AdminPromoCodesDeleteContainer } from '@eye8/admin/pages/promo-codes/delete/container';
import { AdminPromoCodesEditContainer } from '@eye8/admin/pages/promo-codes/edit/container';
import { AdminPromoCodesListContainer } from '@eye8/admin/pages/promo-codes/list/container';

import { Page } from '../../components';

export const AdminPromoCodes = () => (
  <Page
    ListComponent={AdminPromoCodesListContainer}
    CreateComponent={AdminPromoCodesCreateContainer}
    EditComponent={AdminPromoCodesEditContainer}
    DeleteComponent={AdminPromoCodesDeleteContainer}
  />
);
