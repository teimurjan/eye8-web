/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

import { Hero } from 'src/components/admin-ui/Hero/Hero';
import { HeroBody } from 'src/components/admin-ui/HeroBody/HeroBody';
import { Subtitle } from 'src/components/admin-ui/Subtitle/Subtitle';
import { Title } from 'src/components/admin-ui/Title/Title';

interface IProps {
  title?: string | undefined;
  description?: string | undefined;
  CTA?: React.ReactNode | undefined;
}

export const NoDataAvailable = ({ title, description, CTA }: IProps) => (
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
