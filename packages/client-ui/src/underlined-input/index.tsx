/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import InputMask from 'react-input-mask';

import { HelpText } from '@eye8/client-ui';
import { useBoolean, useDebounce, useMultipleRefs } from '@eye8/shared/hooks';
import { isIOS } from '@eye8/shared/utils';

export interface Props {
  error?: string;
  className?: string;
  type?: string;
  placeholder: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  value?: string;
  disabled?: boolean;
  autoFocusDelay?: number; // Works only for non-ios as ios devices do not open keyboard on programatical focus
  autoFocus?: boolean; // Works only for non-ios as ios devices do not open keyboard on programatical focus
  mask?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  append?: React.ReactNode;
}

const VERTICAL_PADDING_PX = 7.5;
const HORIZONTAL_PADDING_PX = 2.5;

export default React.forwardRef<HTMLInputElement, Props>(
  (
    {
      containerRef,
      className,
      error,
      placeholder,
      onFocus,
      autoFocusDelay,
      onBlur,
      mask = '',
      append,
      autoFocus,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    const theme = useTheme<ClientUITheme>();
    const { value: isFocused, setNegative: blur, setPositive: focus } = useBoolean();

    // Debounce error so it does not disappear till the closing transition is finished
    const debouncedError = useDebounce(error, 300);

    const onFocus_: Props['onFocus'] = React.useCallback(
      (e) => {
        focus();
        onFocus && onFocus(e);
      },
      [focus, onFocus],
    );
    const onBlur_: Props['onBlur'] = React.useCallback(
      (e) => {
        blur();
        onBlur && onBlur(e);
      },
      [blur, onBlur],
    );

    const ref_ = useMultipleRefs(ref, innerRef);

    const isAutoFocusDelayEnabled = !isIOS() && autoFocusDelay;
    React.useEffect(() => {
      if (!isAutoFocusDelayEnabled) {
        return;
      }

      let timeoutId: NodeJS.Timeout;
      if (autoFocusDelay && innerRef && innerRef.current) {
        timeoutId = setTimeout(() => {
          innerRef.current!.focus();
        }, autoFocusDelay);
      }

      return () => clearTimeout(timeoutId);
    }, [innerRef, autoFocusDelay, isAutoFocusDelayEnabled]);

    return (
      <div
        ref={containerRef}
        css={css`
          padding: 2.5px 0;
        `}
      >
        <div
          className={className}
          data-focused={isFocused}
          data-has-error={!!error}
          css={css`
            position: relative;
            overflow: hidden;

            &::after {
              content: '';
              background: linear-gradient(to right, ${theme.primaryColor} 50%, ${theme.borderColor} 50%);
              transition: transform 500ms, color 200ms;
              transform: translateX(-50%);
              position: absolute;
              bottom: 0;
              left: 0;
              height: 1px;
              width: 200%;
            }

            &[data-focused='true']::after {
              transform: translateX(0%);
            }

            &[data-has-error='true']::after {
              background: ${theme.dangerColor};
            }
          `}
        >
          <InputMask
            disabled={false}
            mask={mask}
            css={css`
              border: none;
              padding: ${VERTICAL_PADDING_PX + 15}px ${HORIZONTAL_PADDING_PX}px ${VERTICAL_PADDING_PX}px
                ${HORIZONTAL_PADDING_PX}px;
              font-size: 16px;
              background: transparent;
              width: 100%;
              color: ${theme.textColor};

              &:focus {
                outline: none;
              }
            `}
            onFocus={onFocus_}
            onBlur={onBlur_}
            inputRef={ref_}
            autoFocus={isAutoFocusDelayEnabled ? false : autoFocus}
            {...props}
          />
          <span
            css={css`
              position: absolute;
              left: ${HORIZONTAL_PADDING_PX}px;
              bottom: ${VERTICAL_PADDING_PX}px;
              pointer-events: none;
              transition: all 400ms;
              font-size: 16px;
              transform: translateY(0) scale(1);
              transform-origin: 0 50%;
              color: ${theme.textSecondaryColor};

              [data-focused='true'] > & {
                color: ${theme.textColor};
                transform: translateY(-20px) scale(0.65);
              }

              input:not([value='']) ~ & {
                transform: translateY(-20px) scale(0.65);
                color: ${theme.textColor};
              }
            `}
          >
            {placeholder}
          </span>
          {append}
        </div>
        <HelpText
          color={HelpText.Color.Danger}
          css={css`
            display: block;
            max-height: 1px;
            transition: max-height 300ms;
            padding: 0 ${HORIZONTAL_PADDING_PX}px;
            overflow: hidden;

            [data-has-error='true'] ~ & {
              max-height: 30px;
            }
          `}
        >
          {/* Show debounced error till the help text is hidden */}
          {error ? error : debouncedError}
        </HelpText>
      </div>
    );
  },
);
