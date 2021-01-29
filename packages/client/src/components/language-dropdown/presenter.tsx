import React from 'react';

import { IntlService } from '@eye8/service/intl';
import { PopoverTriggerClickProps, PopoverPlacement, PopoverTriggerHoverProps } from '@eye8/shared/components';
import { safeWindowOperation } from '@eye8/shared/utils';

interface Props {
  View: React.ComponentType<ViewProps>;
  intlService: IntlService;
  TriggerComponent: React.ComponentType<PopoverTriggerClickProps> | React.ComponentType<PopoverTriggerHoverProps>;
}

export interface ViewProps {
  changeLocale: IntlService['setLocale'];
  TriggerComponent: Props['TriggerComponent'];
  className?: string;
  triggerClassName?: string;
  openOnHover?: boolean;
  placement?: PopoverPlacement;
  offset?: number[];
}

const LanguageDropdownPresenter = ({ View, intlService, TriggerComponent, ...viewProps }: Props) => {
  const changeLocale = React.useCallback(
    (newLocale: string) => {
      if (intlService.getLocale() !== newLocale) {
        intlService.setLocale(newLocale);
        safeWindowOperation((w) => w.location.reload());
      }
    },
    [intlService],
  );

  return <View changeLocale={changeLocale} TriggerComponent={TriggerComponent} {...viewProps} />;
};

export default LanguageDropdownPresenter;
