/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Plus as PlusIcon, Minus as MinusIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Button, HelpText, IconWrapper, Title } from '@eye8/client-ui';
import { IconSize } from '@eye8/shared/styles';
import { preventDefault } from '@eye8/shared/utils';

interface IProps {
  count: number;
  allowedCount: number;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

export const Quantity = ({ count, allowedCount, onAddClick, onRemoveClick }: IProps) => {
  const intl = useIntl();

  return (
    <div
      css={css`
        padding-top: 1rem;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Button circled size="mini" onClick={preventDefault(onRemoveClick)}>
          <IconWrapper>
            <MinusIcon size={IconSize.Small} />
          </IconWrapper>
        </Button>
        <Title
          size={6}
          css={css`
            margin: 0 15px;
          `}
        >
          {count}
        </Title>
        <Button circled size="mini" onClick={preventDefault(onAddClick)}>
          <IconWrapper>
            <PlusIcon size={IconSize.Small} />
          </IconWrapper>
        </Button>
      </div>
      {count > allowedCount && (
        <HelpText color={HelpText.Color.Danger}>
          {intl.formatMessage({ id: 'Cart.onlySomeAvailable' }, { quantity: allowedCount })}
        </HelpText>
      )}
    </div>
  );
};