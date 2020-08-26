/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

enum Size {
  Small = 'small',
  Default = 'default',
}

enum Color {
  Gray = 'gray',
  Default = 'default',
}

interface IProps {
  size?: Size;
  color?: Color;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  initialChecked?: boolean;
  className?: string;
}

const SWITCH_WIDTH_PX = 44;
const SWITCH_HEIGHT_PX = 24;
const DOT_SIZE_PX = 18;
const DOT_OFFSET_LEFT_PX = 3;
const DOT_OFFSET_BOTTOM_PX = 2;

const SMALL_SWITCH_WIDTH_PX = 34;
const SMALL_SWITCH_HEIGHT_PX = 18;
const SMALL_DOT_SIZE_PX = 14;
const SMALL_DOT_OFFSET_LEFT_PX = 2;
const SMALL_DOT_OFFSET_BOTTOM_PX = 1;

const useDimensions = (size: Size) => {
  if (size === Size.Small) {
    return {
      switchWidthPx: SMALL_SWITCH_WIDTH_PX,
      switchHeightPx: SMALL_SWITCH_HEIGHT_PX,
      dotSizePx: SMALL_DOT_SIZE_PX,
      dotOffsetLeftPx: SMALL_DOT_OFFSET_LEFT_PX,
      dotOffsetBottomPx: SMALL_DOT_OFFSET_BOTTOM_PX,
    };
  }

  return {
    switchWidthPx: SWITCH_WIDTH_PX,
    switchHeightPx: SWITCH_HEIGHT_PX,
    dotSizePx: DOT_SIZE_PX,
    dotOffsetLeftPx: DOT_OFFSET_LEFT_PX,
    dotOffsetBottomPx: DOT_OFFSET_BOTTOM_PX,
  };
};

export const Toggle = ({ size = Size.Default, color = Color.Default, onChange, initialChecked, className }: IProps) => {
  const theme = useTheme<ClientUITheme>();
  const { switchWidthPx, switchHeightPx, dotOffsetLeftPx, dotOffsetBottomPx, dotSizePx } = useDimensions(size);
  const [checked, setChecked] = React.useState(initialChecked);
  return (
    <label
      className={classNames(className, size, color)}
      css={css`
        position: relative;
        display: inline-block;
        width: ${switchWidthPx}px;
        height: ${switchHeightPx}px;
      `}
    >
      <input
        type="checkbox"
        css={css`
          opacity: 0;
          width: 0;
          height: 0;
        `}
        onChange={(e) => {
          setChecked(!checked);
          onChange && onChange(e);
        }}
        checked={checked}
      />
      <span
        css={css`
          border-radius: ${switchHeightPx}px;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${theme.toggleBackgroundColor};
          border: 1px solid ${theme.toggleDotColor};
          transition: 0.4s;

          &:before {
            position: absolute;
            content: '';
            height: ${dotSizePx}px;
            width: ${dotSizePx}px;
            left: ${dotOffsetLeftPx}px;
            bottom: ${dotOffsetBottomPx}px;
            border-radius: 50%;
            background-color: ${theme.toggleDotColor};
            transition: 0.4s;
          }

          input:checked + &:before {
            transform: translateX(${dotSizePx}px);
          }

          label.gray > & {
            background-color: ${theme.toggleGrayBackgroundColor};
            border: 1px solid ${theme.toggleGrayDotColor};

            &:before {
              background-color: ${theme.toggleGrayDotColor};
            }
          }
        `}
      ></span>
    </label>
  );
};

Toggle.Size = Size;
Toggle.Color = Color;
