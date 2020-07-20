/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faGlobe, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover, TriggerClickProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { IViewProps as IProps } from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';

const nameOfLocale = {
  en: 'English',
  ru: 'Русский',
};

const Trigger = React.forwardRef<HTMLDivElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();

  const onClick: React.MouseEventHandler<HTMLDivElement> = React.useCallback(
    e => {
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
    const theme = useTheme<ClientUITheme>();
    return (
      <Popover<HTMLDivElement>
        TriggerComponent={TriggerComponent}
        openOnHover={openOnHover}
        placement={placement}
        offset={offset}
      >
        <Popover.Content ref={ref} className={className}>
          {locales.map(locale => {
            const onClick = () => changeLocale(locale);
            return (
              <Anchor key={locale} onClick={onClick} weight={Anchor.Weight.Thin}>
                {nameOfLocale[locale] || locale}
                {locale === currentLocale && (
                  <span
                    css={css`
                      margin-left: 7.5px;
                      color: ${theme.successColor};
                    `}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              </Anchor>
            );
          })}
        </Popover.Content>
      </Popover>
    );
  },
);
