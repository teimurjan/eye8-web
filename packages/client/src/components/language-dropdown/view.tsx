import React from 'react';
import { useIntl } from 'react-intl';

import { Anchor, Select } from '@eye8/client-ui';
import { ViewProps as Props } from '@eye8/client/components/language-dropdown/presenter';
import { Popover } from '@eye8/shared/components';
import { availableLocales, getLocaleName } from '@eye8/shared/utils';

export const LanguageDropdownView = React.forwardRef<HTMLDivElement, Props>(
  ({ className, changeLocale, TriggerComponent, openOnHover, placement, offset }, ref) => {
    const intl = useIntl();

    return (
      <Popover<HTMLDivElement>
        TriggerComponent={TriggerComponent}
        openOnHover={openOnHover}
        placement={placement}
        offset={offset}
        mouseOutsideOffset={10}
      >
        <Popover.Content ref={ref} className={className}>
          {availableLocales.map((locale) => {
            const onClick = () => changeLocale(locale);
            return (
              <Anchor key={locale} onClick={onClick} flex>
                {getLocaleName(locale)}
                {locale === intl.locale && <Select.Option.CheckedFlag />}
              </Anchor>
            );
          })}
        </Popover.Content>
      </Popover>
    );
  },
);
