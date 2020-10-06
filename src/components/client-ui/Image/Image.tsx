/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { AlertTriangle as AlertTriangleIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { Tooltip } from 'src/components/client-ui/Tooltip/Tooltip';
import { useBoolean } from 'src/hooks/useBoolean';
import { IconSizes } from 'src/styles/icon';
import { arePropsEqual } from 'src/utils/propEquality';

interface IProps {
  src: string;
  alt: string;
  className?: string;
  squared?: boolean;
}

const Image = ({ src, alt, className, squared = true }: IProps) => {
  const intl = useIntl();
  const imageRef = React.useRef<HTMLImageElement>(null);
  const theme = useTheme<ClientUITheme>();
  const { value: isLoaded, setPositive: setLoaded } = useBoolean(false);
  const { value: hasError, setPositive: setErrored } = useBoolean(false);

  React.useEffect(() => {
    if (imageRef.current?.complete) {
      const event = new Event('load');
      imageRef.current!.dispatchEvent(event);
    }
  }, [imageRef]);

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &.squared {
          &::after {
            content: '';
            display: block;
            padding-bottom: 100%;
          }
        }
      `}
      className={classNames(className, { loaded: isLoaded, squared })}
    >
      <div
        css={css`
          width: 100%;
          height: 100%;
          background: ${theme.backgroundGrayColor};
          transition: opacity 300ms;
          opacity: 1;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;

          .loaded > & {
            opacity: 0;
          }
        `}
      >
        {hasError && (
          <Tooltip
            renderTrigger={({ ref, open }) => (
              <IconWrapper
                ref={ref}
                css={css`
                  z-index: 1;
                  color: ${theme.textFadedColor};
                `}
                onMouseEnter={open}
              >
                <AlertTriangleIcon size={IconSizes.Large} />
              </IconWrapper>
            )}
          >
            {intl.formatMessage({ id: 'errors.brokenImage' })}
          </Tooltip>
        )}
      </div>
      <img
        ref={imageRef}
        onLoad={setLoaded}
        onError={setErrored}
        css={css`
          width: 100%;
          height: auto;
          transition: opacity 300ms;

          opacity: 0;

          .loaded > & {
            opacity: 1;
          }
        `}
        src={src}
        alt={alt}
      />
    </div>
  );
};

const MemoizedImage = React.memo<IProps>(Image, (prevProps, nextProps) => arePropsEqual(prevProps, nextProps));

export { MemoizedImage as Image };
