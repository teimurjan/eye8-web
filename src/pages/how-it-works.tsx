import React from 'react';
import { useIntl } from 'react-intl';

import { forceSSR } from 'src/_app/forceSSR';
import { Story } from 'src/components/client-ui/Story/Story';
import { Layout } from 'src/components/Client/Layout';
import { withPublicURL } from 'src/utils/url';

const HowItWorks = () => {
  const intl = useIntl();

  return (
    <Layout>
      <Story
        type={Story.SourceType.Video}
        src={withPublicURL('/video/making-order.mov')}
        title={<Story.Title>{intl.formatMessage({ id: 'HowItWorks.makingOrder.title' })}</Story.Title>}
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
