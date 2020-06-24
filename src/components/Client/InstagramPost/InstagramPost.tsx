/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';

import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';

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
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const [response, setResponse] = React.useState<Response | undefined>(undefined);
  const [isRendered, setRendered] = React.useState(false);

  React.useEffect(() => {
    if (isRendered && response) {
      const el = document.querySelector(`.instagram-embed-${id}`);
      const iframe = document.querySelector(`.instagram-embed-${id} iframe`);
      if (el) {
        const currentWidth = el.clientWidth;
        const delta = currentWidth / response.thumbnail_width;
        const currentThumbnailHeight = response.thumbnail_height * delta;
        (iframe as HTMLElement).style.height = `${currentThumbnailHeight + (isMobile ? 230 : 200)}px`;
      }
    }
  }, [isRendered, response, id, isMobile]);

  return (
    <InstagramEmbed
      css={css`
        width: 360px !important;
        @media ${mediaQueries.maxWidth768} {
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
