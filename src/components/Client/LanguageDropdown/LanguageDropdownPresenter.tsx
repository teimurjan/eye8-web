import * as React from 'react';

import { PopoverPlacement } from 'src/components/client-ui/Popover/Popover';
import { TriggerClickProps, TriggerHoverProps } from 'src/components/client-ui/Popover/Popover';
import { IIntlService } from 'src/services/IntlService';
import { safeWindowOperation } from 'src/utils/dom';

interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  intlService: IIntlService;
  TriggerComponent: React.ComponentType<TriggerClickProps> | React.ComponentType<TriggerHoverProps>;
}

export interface IViewProps {
  changeLocale: IIntlService['setLocale'];
  TriggerComponent: IProps['TriggerComponent'];
  className?: string;
  triggerClassName?: string;
  openOnHover?: boolean;
  placement?: PopoverPlacement;
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
