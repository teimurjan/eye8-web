import React from 'react';
import { useIntl } from 'react-intl';

import { Story } from 'src/components/client-ui/Story/Story';
import { Layout } from 'src/components/Client/Layout';

const HowItWorks = () => {
  const intl = useIntl();

  return (
    <Layout>
      <Story
        type={Story.SourceType.Video}
        src="/video/making-order.mov"
        title={<Story.Title>{intl.formatMessage({ id: 'HowItWorks.makingOrder.title' })}</Story.Title>}
        description={
          <Story.Description>
            {[1, 2, 3, 4].map(i => (
              <React.Fragment key={i}>
                - {intl.formatMessage({ id: `HowItWorks.makingOrder.description.${i}` })}
                <br />
              </React.Fragment>
            ))}
          </Story.Description>
        }
      />
      <Story
        src="/img/delievery.jpg"
        title={<Story.Title>{intl.formatMessage({ id: 'HowItWorks.delievery.title' })}</Story.Title>}
        description={
          <Story.Description>{intl.formatMessage({ id: 'HowItWorks.delievery.description' })}</Story.Description>
        }
        rtl
      />
      <Story
        src="/img/fitting.jpg"
        title={<Story.Title>{intl.formatMessage({ id: 'HowItWorks.fitting.title' })}</Story.Title>}
        description={
          <Story.Description>{intl.formatMessage({ id: 'HowItWorks.fitting.description' })}</Story.Description>
        }
      />
    </Layout>
  );
};

export default HowItWorks;
