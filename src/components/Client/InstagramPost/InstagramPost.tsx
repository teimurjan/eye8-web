/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';

import { useDimensions, defaultGetElementDimensions } from 'src/hooks/useDimensions';
import { mediaQueries } from 'src/styles/media';
import { safeDocument } from 'src/utils/dom';

interface Response {
  thumbnail_width: number;
  thumbnail_height: number;
}

interface IProps {
  className?: string;
  url: string;
  id: number;
  wide?: boolean;
}

export const InstagramPost: React.FC<IProps> = ({ className, url, id, wide }) => {
  const [response, setResponse] = React.useState<Response | undefined>(undefined);
  const [isRendered, setRendered] = React.useState(false);

  const getIframe = React.useCallback(
    () => document.querySelector<HTMLIFrameElement>(`.instagram-embed-${id} iframe`),
    [id],
  );
  const adaptHeight = React.useCallback(() => {
    if (isRendered && response) {
      const iframe = getIframe();
      const el = document.querySelector(`.instagram-embed-${id}`);
      if (el && iframe) {
        const currentWidth = el.clientWidth;
        const delta = currentWidth / response.thumbnail_width;
        const currentThumbnailHeight = response.thumbnail_height * delta;
        iframe.style.height = `${currentThumbnailHeight + 205}px`;
      }
    }
  }, [isRendered, response, id, getIframe]);

  React.useEffect(() => {
    adaptHeight();
  }, [adaptHeight]);

  useDimensions({ current: safeDocument(d => d.body, null) }, defaultGetElementDimensions, adaptHeight);

  return (
    <InstagramEmbed
      css={css`
        width: 360px !important;
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
      className={classNames(`instagram-embed-${id}`, className, { wide })}
      url={url}
      hideCaption={true}
      protocol=""
      injectScript
      onSuccess={setResponse}
      onAfterRender={() => {
        setRendered(true);
      }}
    />
  );
};
