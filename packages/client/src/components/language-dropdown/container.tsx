import React from 'react';

import { LanguageDropdownPresenter, IViewProps } from '@eye8/client/components/language-dropdown/presenter';
import { LanguageDropdownView } from '@eye8/client/components/language-dropdown/view';
import { useDependencies } from '@eye8/di';

export const LanguageDropdownContainer = React.forwardRef<
  HTMLDivElement,
  Pick<IViewProps, 'TriggerComponent' | 'className' | 'openOnHover' | 'placement' | 'offset'>
>((viewProps, ref) => {
  const { dependencies } = useDependencies();

  return (
    <LanguageDropdownPresenter
      View={(props) => <LanguageDropdownView ref={ref} {...props} />}
      intlService={dependencies.services.intl}
      {...viewProps}
    />
  );
});
