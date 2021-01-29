import React from 'react';

import { useDI } from '@eye8/di';

import LanguageDropdownPresenter, { ViewProps } from './presenter';
import LanguageDropdownView from './view';

const LanguageDropdownContainer = React.forwardRef<
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

export default LanguageDropdownContainer;
