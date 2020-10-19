import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover } from 'src/components/client-ui/Popover/Popover';
import { Select } from 'src/components/client-ui/Select/Select';
import { IViewProps as IProps } from 'src/components/client/LanguageDropdown/LanguageDropdownPresenter';
import { availableLocales, getLocaleName } from 'src/utils/locale';

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
