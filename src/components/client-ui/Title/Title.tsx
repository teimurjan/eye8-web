import { ClassNames } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import times from 'lodash/times';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

export interface IProps {
  children?: React.ReactNode | string;
  size: 1 | 2 | 3 | 4 | 5 | 6;
  tag?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const fontSizes = {
  1: 54,
  2: 42,
  3: 30,
  4: 24,
  5: 20,
  6: 16,
};

const mobileFontSizes = {
  1: 36,
  2: 30,
  3: 26,
  4: 22,
  5: 18,
  6: 16,
};

export const Title = ({ children, size, tag = size, className }: IProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <ClassNames>
      {({ css }) =>
        React.createElement(
          `h${tag}`,
          {
            className: classNames(
              className,
              `size-${size}`,
              css`
                font-weight: bold;
                color: ${theme.textColor};

                ${times(6)
                  .map((i) => {
                    const sizeI = i + 1;
                    const fontSize = fontSizes[sizeI];
                    return `
                    &.size-${sizeI} {
                      font-size: ${fontSize}px;

                      @media ${mediaQueries.maxWidth768} {
                        font-size: ${mobileFontSizes[size]}px;
                      }
                    }
                  `;
                  })
                  .join('\n')}
              `,
            ),
          },
          children,
        )
      }
    </ClassNames>
  );
};
