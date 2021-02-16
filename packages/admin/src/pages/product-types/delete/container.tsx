import React from 'react';
import { useIntl } from 'react-intl';

import { useDI } from '@eye8/di';
import { ProductTypeDeletionWithProductsError } from '@eye8/service';

import { DeleteModal } from '../../../components';
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

  return (
    <DeleteModal
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await di.service.productType.delete(id, { forever: deleted });
        deleteProductType(id);
      }}
      checkExistence={({ id, deleted }) => di.service.productType.exists(id, { deleted })}
      getBackPath={() => `/admin/productTypes`}
      info={intl.formatMessage({ id: 'AdminProductTypes.delete.info' })}
    />
  );
};

export default AdminProductTypesDeleteContainer;
