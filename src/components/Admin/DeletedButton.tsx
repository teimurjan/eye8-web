import React from 'react';
import { useIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';

enum State {
  Active,
  Idle,
}

interface IProps {
  state: State;
  pathPrefix: string;
}

export const DeletedButton = ({ state, pathPrefix }: IProps) => {
  const intl = useIntl();

  return state === State.Active ? (
    <ReactRouterLinkButton to={pathPrefix}>{intl.formatMessage({ id: 'common.showCurrent' })}</ReactRouterLinkButton>
  ) : (
    <ReactRouterLinkButton to={`${pathPrefix}?deleted=true`}>
      {intl.formatMessage({ id: 'common.showDeleted' })}
    </ReactRouterLinkButton>
  );
};

DeletedButton.State = State;
