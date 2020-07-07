import * as React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';

import { DeleteModalPresenter, IProps as IPresenterProps } from 'src/components/Admin/DeleteModal/DeleteModalPresenter';
import { DeleteModalView } from 'src/components/Admin/DeleteModal/DeleteModalView';

const ConnectedDeleteModalPresenter = withRouter(DeleteModalPresenter);

const View = injectIntl(DeleteModalView);

export const DeleteModalContainer = (props: Omit<IPresenterProps, 'View'>) => (
  <ConnectedDeleteModalPresenter View={View} {...props} />
);
