import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminCategoriesState } from '@eye8/admin/state/categories';
import { useDependencies } from '@eye8/di';
import { CategoryHasChildrenError, CategoryHasProductTypesError } from '@eye8/service/category';

const getErrorMessageID = (e: Error) => {
  if (e instanceof CategoryHasChildrenError) {
    return 'AdminCategories.errors.hasChildren';
  }
  if (e instanceof CategoryHasProductTypesError) {
    return 'AdminCategories.errors.hasProductTypes';
  }

  return 'errors.common';
};

export const AdminCategoriesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteCategory },
  } = useAdminCategoriesState();

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id }) => {
        await dependencies.services.category.delete(id);
        deleteCategory(id);
      }}
      checkExistence={({ id }) => dependencies.services.category.exists(id)}
      getBackPath={() => '/admin/categories'}
    />
  );
};