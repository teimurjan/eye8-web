import React from 'react';

import { useDI } from '@eye8/di';
import { CategoryDeletionWithChildrenError, CategoryDeletionWithProductTypesError } from '@eye8/service';

import { DeleteModal } from '../../../components';
import { useAdminCategoriesState } from '../../../state/categories';

const getErrorMessageID = (e: Error) => {
  if (e instanceof CategoryDeletionWithChildrenError) {
    return 'AdminCategories.errors.hasChildren';
  }
  if (e instanceof CategoryDeletionWithProductTypesError) {
    return 'AdminCategories.errors.hasProductTypes';
  }

  return 'errors.common';
};

const AdminCategoriesDelete = () => {
  const { di } = useDI();
  const { remove: deleteCategory } = useAdminCategoriesState();

  return (
    <DeleteModal
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id }) => {
        await di.service.category.delete(id);
        deleteCategory(id);
      }}
      checkExistence={({ id }) => di.service.category.exists(id)}
      getBackPath={() => '/admin/categories'}
    />
  );
};

export default AdminCategoriesDelete;
