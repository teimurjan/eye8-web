import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as categoryService from 'src/services/CategoryService';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';

const getErrorMessageID = (e: Error) => {
  if (e instanceof categoryService.errors.CategoryHasChildren) {
    return 'AdminCategories.errors.hasChildren';
  }
  if (e instanceof categoryService.errors.CategoryHasProductTypes) {
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
