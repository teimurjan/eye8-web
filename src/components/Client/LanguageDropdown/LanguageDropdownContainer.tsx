import * as React from 'react';

import {
  LanguageDropdownPresenter,
  IViewProps,
} from 'src/components/client/LanguageDropdown/LanguageDropdownPresenter';
import { LanguageDropdownView } from 'src/components/client/LanguageDropdown/LanguageDropdownView';
import { useDependencies } from 'src/DI/DI';

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
