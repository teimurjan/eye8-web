/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Hero } from 'src/components/admin-ui/Hero/Hero';
import { HeroBody } from 'src/components/admin-ui/HeroBody/HeroBody';
import { Title } from 'src/components/admin-ui/Title/Title';
import { IViewProps as IProps } from 'src/components/ConfirmSignup/ConfirmSignupPresenter';
import { useDebounce } from 'src/hooks/useDebounce';
import { PAGE_LOADER_ID } from 'src/utils/dom';

export const ConfirmSignupView = ({ isLoading, error }: IProps) => {
  const intl = useIntl();

  const { content, className } = React.useMemo(() => {
    if (isLoading) {
      return { content: intl.formatMessage({ id: 'common.loading' }), className: 'is-primary' };
    }

    if (error) {
      return { content: intl.formatMessage({ id: error }), className: 'is-danger' };
    } else {
      return { content: intl.formatMessage({ id: 'ConfirmSignup.success' }), className: 'is-success' };
    }
  }, [error, intl, isLoading]);

  const debouncedContent = useDebounce(content, 500);
  const debouncedClassName = useDebounce(className, 500);

  return (
    <Hero
      className={debouncedClassName}
      css={css`
        height: 100vh;
        width: 100vw;
        transition: background 500ms;
      `}
    >
      <Global
        styles={css`
          #${PAGE_LOADER_ID} {
            display: none;
          }
        `}
      />
      <HeroBody
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Container>
          <Title size={2}>{debouncedContent}</Title>
        </Container>
      </HeroBody>
    </Hero>
  );
};
