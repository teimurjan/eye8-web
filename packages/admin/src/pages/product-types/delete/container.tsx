import React from 'react';
import { useIntl } from 'react-intl';

import { useDI } from '@eye8/di';
import { ProductTypeDeletionWithProductsError } from '@eye8/service';
import { buildSearchString } from '@eye8/shared/utils';

import { DeleteModal } from '../../../components';
import { useAdminProductTypesFilters } from '../../../hooks';
import { useAdminProductTypesState } from '../../../state';

const getErrorMessageID = (e: Error) => {
  if (e instanceof ProductTypeDeletionWithProductsError) {
    return 'AdminProductTypes.errors.hasProducts';
  }

  return 'errors.common';
};

const AdminProductTypesDeleteContainer = () => {
  const intl = useIntl();
  const { di } = useDI();
  const { remove: deleteProductType } = useAdminProductTypesState();
  const {
    filters: { deleted },
  } = useAdminProductTypesFilters();

  return (
    <DeleteModal
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id }) => {
        await di.service.productType.delete(id, { forever: deleted });
        deleteProductType(id);
      }}
      checkExistence={({ id }) => di.service.productType.exists(id, { deleted })}
      getBackPath={() => `/admin/productTypes${buildSearchString({ deleted })}`}
      info={intl.formatMessage({ id: 'AdminProductTypes.delete.info' })}
    />
  );
};

export default AdminProductTypesDeleteContainer;
