import * as React from 'react';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover } from 'src/components/client-ui/Popover/Popover';
import { Select } from 'src/components/client-ui/Select/Select';
import { IViewProps as IProps } from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';

const nameOfLocale = {
  en: 'English',
  ru: 'Русский',
};
export const LanguageDropdownView = React.forwardRef<HTMLDivElement, IProps>(
  ({ className, locales, changeLocale, currentLocale, TriggerComponent, openOnHover, placement, offset }, ref) => {
    return (
      <Popover<HTMLDivElement>
        TriggerComponent={TriggerComponent}
        openOnHover={openOnHover}
        placement={placement}
        offset={offset}
        mouseOutsideOffset={10}
      >
        <Popover.Content ref={ref} className={className}>
          {locales.map((locale) => {
            const onClick = () => changeLocale(locale);
            return (
              <Anchor key={locale} onClick={onClick} flex>
                {nameOfLocale[locale] || locale}
                {locale === currentLocale && <Select.Option.CheckedFlag />}
              </Anchor>
            );
          })}
        </Popover.Content>
      </Popover>
    );
  },
);
