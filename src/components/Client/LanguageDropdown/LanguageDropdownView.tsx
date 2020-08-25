/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover, TriggerClickProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { Select } from 'src/components/client-ui/Select/Select';
import { IViewProps as IProps } from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';

const nameOfLocale = {
  en: 'English',
  ru: 'Русский',
};

const Trigger = React.forwardRef<HTMLDivElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();

  const onClick: React.MouseEventHandler<HTMLDivElement> = React.useCallback(
    (e) => {
      e.stopPropagation();
      props.onClick(e);
    },
    [props],
  );

  return (
    <div
      css={css`
        cursor: pointer;
      `}
      ref={ref}
      {...props}
      onClick={onClick}
    >
      {intl.formatMessage({ id: 'AdminMenu.changeLangaugeLinkText' })}
      <span
        css={css`
          margin-left: 7.5px;
          line-height: 1;
        `}
      >
        <FontAwesomeIcon icon={faGlobe} />
      </span>
    </div>
  );
});

export const LanguageDropdownView = React.forwardRef<HTMLDivElement, IProps>(
  (
    { className, locales, changeLocale, currentLocale, TriggerComponent = Trigger, openOnHover, placement, offset },
    ref,
  ) => {
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
