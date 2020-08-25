import * as React from 'react';

import { PopoverPlacement } from 'src/components/client-ui/Popover/Popover';
import { TriggerClickProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { IIntlService } from 'src/services/IntlService';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { safeWindowOperation } from 'src/utils/dom';

interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  intlService: IIntlService;
}

export interface IViewProps {
  locales: string[];
  changeLocale: IIntlService['setLocale'];
  currentLocale: string;
  TriggerComponent?: React.ComponentType<PopoverTriggerProps>;
  className?: string;
  openOnHover?: boolean;
  placement?: PopoverPlacement;
  offset?: number[];
}

export const LanguageDropdownPresenter = ({
  View,
  intlState: { availableLocales, locale },
  intlService,
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
      {...viewProps}
    />
  );
};
