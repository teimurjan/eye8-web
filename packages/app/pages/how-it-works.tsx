import React from 'react';
import { useIntl } from 'react-intl';

import { Story } from '@eye8/client-ui';
import { Layout } from '@eye8/client/components/layout';
import { withPublicURL } from '@eye8/shared/utils';

import { forceSSR } from '../src/force-ssr';

const HowItWorks = () => {
  const intl = useIntl();

  return (
    <Layout>
      <Story
        type={Story.SourceType.Video}
        src={withPublicURL('/video/making-order.mov')}
        title={
          <Story.Title>
            {intl.formatMessage({ id: 'HowItWorks.makingOrder.title' }, { shopName: process.env.SHOP_NAME })}
          </Story.Title>
        }
        description={
          <Story.Description>
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                - {intl.formatMessage({ id: `HowItWorks.makingOrder.description.${i}` })}
                <br />
              </React.Fragment>
            ))}
          </Story.Description>
        }
      />
      <Story
        src={withPublicURL('/img/delievery.jpg')}
        title={<Story.Title>{intl.formatMessage({ id: 'HowItWorks.delievery.title' })}</Story.Title>}
        description={
          <Story.Description>{intl.formatMessage({ id: 'HowItWorks.delievery.description' })}</Story.Description>
        }
        rtl
      />
      <Story
        src={withPublicURL('/img/fitting.jpg')}
        title={<Story.Title>{intl.formatMessage({ id: 'HowItWorks.fitting.title' })}</Story.Title>}
        description={
          <Story.Description>{intl.formatMessage({ id: 'HowItWorks.fitting.description' })}</Story.Description>
        }
      />
    </Layout>
  );
};

export { forceSSR as getServerSideProps };

export default HowItWorks;
