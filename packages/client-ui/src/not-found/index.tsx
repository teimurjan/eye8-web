/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { Hero, HeroBody } from '@eye8/admin-ui/index';
import { Title, LinkButton } from '@eye8/client-ui';

export interface IProps {
  title?: string;
  ctaText?: string;
  ctaHref?: string;
}

const NotFound = ({ title, ctaText, ctaHref }: IProps) => {
  const intl = useIntl();

  return (
    <Hero
      css={css`
        flex: 1;
      `}
      className={classNames('is-large')}
    >
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

export default NotFound;
