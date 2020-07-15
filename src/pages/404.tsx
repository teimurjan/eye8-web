import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { LinkButton } from 'src/components/client-ui/Button/Button';
import { FullSizePage } from 'src/components/common-ui/FullSizePage/FullSizePage';

export default () => {
  const theme = useTheme<ClientUITheme>();

  return (
    <FullSizePage title="404 - NOT FOUND" color={theme.textColor} background={theme.backgroundGrayColor} centered>
      <LinkButton href="/">Home</LinkButton>
    </FullSizePage>
  );
};
