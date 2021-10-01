
import { css } from '@emotion/react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { Title, LinkButton } from '@eye8/client-ui';

export interface Props {
  title?: string;
  ctaText?: string;
  ctaHref?: string;
}

const NotFound = ({ title, ctaText, ctaHref }: Props) => {
  const intl = useIntl();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 50px;
        width: 100%;
      `}
    >
      <Title className="is-uppercase" size={2} tag={1}>
        {title ?? intl.formatMessage({ id: 'NotFound.title' })}
      </Title>
      <LinkButton className={classNames('is-medium', 'is-uppercase')} color="dark" href={ctaHref ?? '/'}>
        {ctaText ?? intl.formatMessage({ id: 'NotFound.goHome.text' })}
      </LinkButton>
    </div>
  );
};

export default NotFound;
