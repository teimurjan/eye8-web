import * as React from 'react';

import {
  LanguageDropdownPresenter,
  IViewProps,
} from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';
import { LanguageDropdownView } from 'src/components/Client/LanguageDropdown/LanguageDropdownView';
import { useDependencies } from 'src/DI/DI';
import { useIntlState } from 'src/state/IntlState';

export const LanguageDropdownContainer = React.forwardRef<
  HTMLDivElement,
  Pick<IViewProps, 'TriggerComponent' | 'className' | 'openOnHover' | 'placement' | 'offset'>
>((viewProps, ref) => {
  const { dependencies } = useDependencies();
  const { intlState } = useIntlState();

  return (
    <LanguageDropdownPresenter
      View={props => <LanguageDropdownView ref={ref} {...props} />}
      intlService={dependencies.services.intl}
      intlState={intlState}
      {...viewProps}
    />
  );
});
