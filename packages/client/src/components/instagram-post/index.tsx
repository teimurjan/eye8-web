/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';

import { useElementDimensions } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';
import { safeDocument, logInfo } from '@eye8/shared/utils';

interface Response {
  thumbnail_width: number;
  thumbnail_height: number;
}

enum Size {
  Wide = 'wide',
}

interface IProps {
  className?: string;
  url: string;
  id: number;
  size?: Size;
}

const IFRAME_HEIGHT_OFFSET_PX = 95;

export const InstagramPost = ({ className, url, id, size }: IProps) => {
  const [response, setResponse] = React.useState<Response | undefined>(undefined);
  const [isRendered, setRendered] = React.useState(false);

  const getIframe = React.useCallback(
    () => document.querySelector<HTMLIFrameElement>(`.instagram-embed-${id} iframe`),
    [id],
  );
  const adaptHeight = React.useCallback(() => {
    if (isRendered && response) {
      const el = document.querySelector(`.instagram-embed-${id}`) as HTMLElement;
      if (el) {
        const currentWidth = el.clientWidth;
        const delta = currentWidth / response.thumbnail_width;
        const currentThumbnailHeight = response.thumbnail_height * delta;
        el.style.height = `${currentThumbnailHeight + IFRAME_HEIGHT_OFFSET_PX}px`;
      }
    }
  }, [isRendered, response, id]);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      const next = () => {
        adaptHeight();
        clearInterval(intervalID);
      };

      try {
        const iframe = getIframe();
        if (iframe && !iframe.contentDocument) {
          logInfo('iframe is loaded', { format: '%s' });
          next();
        }
      } catch (e) {
        logInfo("iframe's contentWindow is blocked by CORS", { format: '%s' });
        next();
      }
    }, 1000);

    return () => clearInterval(intervalID);
  }, [adaptHeight, getIframe]);

  useElementDimensions({ ref: { current: safeDocument((d) => d.body, null) }, onChange: adaptHeight });

  return (
    <InstagramEmbed
      css={css`
        width: 360px !important;
        transition: height 300ms;
        height: 0px;

        iframe {
          height: 100%;
          padding-bottom: 1px !important;
        }

        @media ${mediaQueries.maxWidth768} {
          width: 100% !important;

          iframe {
            min-width: calc(100vw - 80px) !important;
          }

          &.wide iframe {
            min-width: calc(100vw - 30px) !important;
          }
        }
      `}
      className={classNames(`instagram-embed-${id}`, className, size)}
      url={url}
      hideCaption={true}
      protocol=""
      injectScript
      onSuccess={setResponse}
      onAfterRender={() => {
        setRendered(true);
      }}
      clientAccessToken={process.env.FB_CLIENT_ACCESS_TOKEN!}
    />
  );
};

InstagramPost.Size = Size;
