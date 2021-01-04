import React from 'react';
import { withRouter } from 'react-router';

import { DeleteModalPresenter, IProps as IPresenterProps } from '@eye8/admin/components/delete-modal/presenter';
import { DeleteModalView } from '@eye8/admin/components/delete-modal/view';

const ConnectedDeleteModalPresenter = withRouter(DeleteModalPresenter);

export const DeleteModalContainer = (props: Omit<IPresenterProps, 'View'>) => (
  <ConnectedDeleteModalPresenter View={DeleteModalView} {...props} />
);
