import React from 'react';
import { useIntl } from 'react-intl';

import { Anchor, Popover, Select } from '@eye8/client-ui';
import { IViewProps as IProps } from '@eye8/client/components/language-dropdown/presenter';
import { availableLocales, getLocaleName } from '@eye8/shared/utils';

export const LanguageDropdownView = React.forwardRef<HTMLDivElement, IProps>(
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
