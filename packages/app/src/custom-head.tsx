import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

import { withPublicURL } from '@eye8/shared/utils';

const YM_SCRIPT = `
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(${process.env.YM_ACCOUNT_ID}, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true
  });
`;

const FB_PIXEL_SCRIPT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${process.env.FB_PIXEL_ID}'); 
fbq('track', 'PageView');
`;

const CustomHead = () => {
  const intl = useIntl();
  const router = useRouter();

  return (
    <Head>
      <script async src="https://instagram.com/embed.js"></script>
      <script type="text/javascript" dangerouslySetInnerHTML={{ __html: YM_SCRIPT }} />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<div><img src="https://mc.yandex.ru/watch/${process.env.YM_ACCOUNT_ID}" style="position: absolute; left: -9999px" alt="" /></div>`,
        }}
      />
      <script type="text/javascript" dangerouslySetInnerHTML={{ __html: FB_PIXEL_SCRIPT }} />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" src="https://www.facebook.com/tr?id=${process.env.FB_PIXEL_ID}&ev=PageView&noscript=1"alt=""/>`,
        }}
      />
      <link rel="apple-touch-icon" sizes="152x152" href={withPublicURL('img/icons/icon-152x152.png')} />
      <link rel="icon" type="image/png" sizes="32x32" href={withPublicURL('favicon-32x32.png')} />
      <link rel="icon" type="image/png" sizes="16x16" href={withPublicURL('favicon-16x16.png')} />
      <link rel="shortcut icon" href={withPublicURL('favicon.ico')} />
      <link rel="manifest" href={withPublicURL('manifest.json')} />
      <title>{intl.formatMessage({ id: 'Meta.title' }, { shopName: process.env.SHOP_NAME })}</title>
      <meta name="description" content={intl.formatMessage({ id: 'Meta.description' })} />
      <meta
        name="keywords"
        content={intl.formatMessage({ id: 'Meta.keywords' }, { shopName: process.env.SHOP_NAME })}
      />
      <meta name="og:site_name" content={process.env.SHOP_NAME} />
      <meta name="og:url" content={withPublicURL(router.asPath)} />
      <meta name="og:title" content={intl.formatMessage({ id: 'Meta.title' }, { shopName: process.env.SHOP_NAME })} />
      <meta name="og:description" content={intl.formatMessage({ id: 'Meta.description' })} />
      <meta name="og:image" content={withPublicURL('img/preview.jpg')} />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={withPublicURL(router.asPath)} />
      <meta
        name="twitter:title"
        content={intl.formatMessage({ id: 'Meta.title' }, { shopName: process.env.SHOP_NAME })}
      />
      <meta name="twitter:description" content={intl.formatMessage({ id: 'Meta.description' })} />
      <meta name="twitter:image:src" content={withPublicURL('img/preview.jpg')} />
    </Head>
  );
};

export default CustomHead;
