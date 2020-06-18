/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { Title } from 'src/components/client-ui/Title/Title';
import { fadeInFromBottom } from 'src/styles/keyframes';
import { mediaQueries } from 'src/styles/media';
import { easeOutCubic } from 'src/styles/timing-functions';

enum StorySourceType {
  Video,
  Image,
}

interface IProps {
  src: string;
  type?: StorySourceType;
  title: React.ReactNode;
  description: React.ReactNode;
  rtl?: boolean;
  backgroundPosition?: string;
}

export const Story = ({ src, title, description, rtl, backgroundPosition, type = StorySourceType.Image }: IProps) => {
  const media =
    type === StorySourceType.Video ? (
      <div
        css={css`
          flex: 0 0 50%;

          @media ${mediaQueries.maxWidth768} {
            margin-bottom: 20px;
            width: 100%;
            flex: 1 1 300px;
          }
        `}
      >
        <video
          css={css`
            vertical-align: top;
          `}
          height="100%"
          width="100%"
          src={src}
          autoPlay
          loop
        >
          Your browser does not support the video tag.
        </video>
      </div>
    ) : (
      <div
        style={{ backgroundImage: `url(${src})`, backgroundPosition }}
        css={css`
          flex: 0 0 50%;
          height: 650px;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;

          @media ${mediaQueries.maxWidth768} {
            margin-bottom: 20px;
            width: 100%;
            flex: 1 1 300px;
          }
        `}
      ></div>
    );

  return (
    <div
      className={classNames({ rtl })}
      css={css`
        display: flex;
        align-items: center;
        animation: ${fadeInFromBottom} 500ms ${easeOutCubic};

        &.rtl {
          flex-direction: row-reverse;
        }

        @media ${mediaQueries.maxWidth768} {
          margin-bottom: 30px;
          flex-direction: column;

          &.rtl {
            flex-direction: column;
          }
        }
      `}
    >
      {media}
      <div
        css={css`
          flex: 0 0 50%;
          padding: 0 7.5vw;
        `}
      >
        {title}
        {description}
      </div>
    </div>
  );
};

const StoryTitle: React.FC = ({ children }) => (
  <Title
    css={css`
      margin-bottom: 15px;
    `}
    size={3}
  >
    {children}
  </Title>
);

const StoryDescription: React.FC = ({ children }) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <p
      css={css`
        line-height: 1.75;
        color: ${theme.textSecondaryColor};
      `}
    >
      {children}
    </p>
  );
};

Story.Description = StoryDescription;
Story.Title = StoryTitle;
Story.SourceType = StorySourceType;
