import * as React from 'react';
import { withRouter } from 'react-router';

import { DeleteModalPresenter, IProps as IPresenterProps } from 'src/components/admin/DeleteModal/DeleteModalPresenter';
import { DeleteModalView } from 'src/components/admin/DeleteModal/DeleteModalView';

const ConnectedDeleteModalPresenter = withRouter(DeleteModalPresenter);

export const DeleteModalContainer = (props: Omit<IPresenterProps, 'View'>) => (
  <ConnectedDeleteModalPresenter View={DeleteModalView} {...props} />
);
