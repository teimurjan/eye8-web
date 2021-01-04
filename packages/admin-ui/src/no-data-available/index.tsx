/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';

import { Hero, HeroBody, Subtitle, Title } from '@eye8/admin-ui/index';

export interface IProps {
  title?: string | undefined;
  description?: string | undefined;
  CTA?: React.ReactNode | undefined;
}

const Index = ({ title, description, CTA }: IProps) => (
  <Hero className={classNames('is-large')}>
    <HeroBody
      css={css`
        text-align: center;
      `}
    >
      {title && (
        <Title className="is-spaced" size={3}>
          {title}
        </Title>
      )}
      {description && (
        <Subtitle
          css={css`
            margin: 10px 0 !important;
          `}
          size={5}
        >
          {description}
        </Subtitle>
      )}
      {CTA}
    </HeroBody>
  </Hero>
);

export default Index;
