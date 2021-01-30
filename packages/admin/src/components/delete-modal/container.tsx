import React from 'react';
import { withRouter } from 'react-router';

import DeleteModalPresenter, { Props as PresenterProps } from './presenter';
import DeleteModalView from './view';

const ConnectedDeleteModalPresenter = withRouter(DeleteModalPresenter);

const DeleteModal = (props: Omit<PresenterProps, 'View'>) => (
  <ConnectedDeleteModalPresenter View={DeleteModalView} {...props} />
);

export default DeleteModal