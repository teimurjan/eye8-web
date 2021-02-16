/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Button } from '@eye8/client-ui';

import { ViewProps } from './presenter';

const CacheBuster = ({ bust }: ViewProps) => {
  const intl = useIntl();

  return (
    <>
      {intl.formatMessage({ id: 'cacheBuster.refresh' }, { shopName: process.env.SHOP_NAME })}
      <br />
      <Button
        css={css`
          margin: 5px 0;
          text-transform: uppercase;
        `}
        onClick={bust}
        size="small"
      >
        {intl.formatMessage({ id: 'cacheBuster.refresh.action' })}
      </Button>
    </>
  );
};

export default CacheBuster;
