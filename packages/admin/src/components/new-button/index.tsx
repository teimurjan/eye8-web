import React from 'react';

import { LinkButton } from '@eye8/admin-ui/index';

interface IProps {
  pathPrefix: string;
  children: React.ReactNode;
}

export const NewButton = ({ pathPrefix, children }: IProps) => {
  return (
    <LinkButton to={`${pathPrefix}/new`} color="is-primary">
      {children}
    </LinkButton>
  );
};
