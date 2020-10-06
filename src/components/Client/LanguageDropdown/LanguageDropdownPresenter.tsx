import * as React from 'react';

import { PopoverPlacement } from 'src/components/client-ui/Popover/Popover';
import { TriggerClickProps, TriggerHoverProps } from 'src/components/client-ui/Popover/Popover';
import { IIntlService } from 'src/services/IntlService';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { safeWindowOperation } from 'src/utils/dom';

interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  intlService: IIntlService;
  TriggerComponent: React.ComponentType<TriggerClickProps> | React.ComponentType<TriggerHoverProps>;
}

export interface IViewProps {
  locales: string[];
  changeLocale: IIntlService['setLocale'];
  currentLocale: string;
  TriggerComponent: IProps['TriggerComponent'];
  className?: string;
  triggerClassName?: string;
  openOnHover?: boolean;
  placement?: PopoverPlacement;
  offset?: number[];
}

export const LanguageDropdownPresenter = ({
  View,
  intlState: { availableLocales, locale },
  intlService,
  TriggerComponent,
  ...viewProps
}: IProps) => {
  const changeLocale = React.useCallback(
    (newLocale: string) => {
      if (intlService.getLocale() !== newLocale) {
        intlService.setLocale(newLocale);
        safeWindowOperation((w) => w.location.reload());
      }
    },
    [intlService],
  );

  return (
    <View
      locales={availableLocales.map(({ name }) => name)}
      changeLocale={changeLocale}
      currentLocale={locale}
      TriggerComponent={TriggerComponent}
      {...viewProps}
    />
  );
};
