import React from 'react';

import { useDI } from '@eye8/di';
import { CategoryHasChildrenError, CategoryHasProductTypesError } from '@eye8/service/category';

import { DeleteModal } from '../../../components';
import { useAdminCategoriesState } from '../../../state/categories';

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
