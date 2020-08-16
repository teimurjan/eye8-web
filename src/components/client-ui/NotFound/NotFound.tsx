/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { Hero } from 'src/components/admin-ui/Hero/Hero';
import { HeroBody } from 'src/components/admin-ui/HeroBody/HeroBody';
import { LinkButton } from 'src/components/client-ui/Button/Button';
import { Title } from 'src/components/client-ui/Title/Title';

interface IProps {
  title?: string;
  ctaText?: string;
  ctaHref?: string;
}

export const NotFound = ({ title, ctaText, ctaHref }: IProps) => {
  const intl = useIntl();

  return (
    <Hero className={classNames('is-large')}>
      <HeroBody
        css={css`
          text-align: center;
        `}
      >
        <Title className="is-uppercase" size={2} tag={1}>
          {title ?? intl.formatMessage({ id: 'NotFound.title' })}
        </Title>
        <LinkButton className={classNames('is-medium', 'is-uppercase')} color="dark" href={ctaHref ?? '/'}>
          {ctaText ?? intl.formatMessage({ id: 'NotFound.goHome.text' })}
        </LinkButton>
      </HeroBody>
    </Hero>
  );
};
