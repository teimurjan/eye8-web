import React from 'react';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';

interface IProps {
  pathPrefix: string;
  children: React.ReactNode;
}

export const NewButton = ({ pathPrefix, children }: IProps) => {
  return (
    <ReactRouterLinkButton to={`${pathPrefix}/new`} color="is-primary">
      {children}
    </ReactRouterLinkButton>
  );
};
