import React from 'react';

import { IPopoverTriggerClickProps, IPopoverPlacement, IPopoverTriggerHoverProps } from '@eye8/client-ui';
import { IIntlService } from '@eye8/service/intl';
import { safeWindowOperation } from '@eye8/shared/utils';

interface IProps {
  View: React.ComponentType<IViewProps>;
  intlService: IIntlService;
  TriggerComponent: React.ComponentType<IPopoverTriggerClickProps> | React.ComponentType<IPopoverTriggerHoverProps>;
}

export interface IViewProps {
  changeLocale: IIntlService['setLocale'];
  TriggerComponent: IProps['TriggerComponent'];
  className?: string;
  triggerClassName?: string;
  openOnHover?: boolean;
  placement?: IPopoverPlacement;
  offset?: number[];
}

export const LanguageDropdownPresenter = ({ View, intlService, TriggerComponent, ...viewProps }: IProps) => {
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
