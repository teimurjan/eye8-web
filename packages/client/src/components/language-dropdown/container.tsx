import React from 'react';

import { LanguageDropdownPresenter, ViewProps } from '@eye8/client/components/language-dropdown/presenter';
import { LanguageDropdownView } from '@eye8/client/components/language-dropdown/view';
import { useDI } from '@eye8/di';

export const LanguageDropdownContainer = React.forwardRef<
  HTMLDivElement,
  Pick<ViewProps, 'TriggerComponent' | 'className' | 'openOnHover' | 'placement' | 'offset'>
>((viewProps, ref) => {
  const { di } = useDI();

  return (
    <LanguageDropdownPresenter
      View={(props) => <LanguageDropdownView ref={ref} {...props} />}
      intlService={di.service.intl}
      {...viewProps}
    />
  );
});
