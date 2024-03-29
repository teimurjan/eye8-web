import React from 'react';

import { LinkButton } from '@eye8/admin-ui';

interface Props {
  pathPrefix: string;
  children: React.ReactNode;
}

const NewButton = ({ pathPrefix, children }: Props) => {
  return (
    <LinkButton to={`${pathPrefix}/new`} color="is-primary">
      {children}
    </LinkButton>
  );
};

export default NewButton;
