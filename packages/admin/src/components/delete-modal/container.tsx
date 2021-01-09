import React from 'react';
import { withRouter } from 'react-router';

import { DeleteModalPresenter, Props as PresenterProps } from '@eye8/admin/components/delete-modal/presenter';
import { DeleteModalView } from '@eye8/admin/components/delete-modal/view';

const ConnectedDeleteModalPresenter = withRouter(DeleteModalPresenter);

export const DeleteModalContainer = (props: Omit<PresenterProps, 'View'>) => (
  <ConnectedDeleteModalPresenter View={DeleteModalView} {...props} />
);
