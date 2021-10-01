
import { css } from '@emotion/react';
import { Plus as PlusIcon, Minus as MinusIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Button, HelpText, Title } from '@eye8/client-ui';
import { IconWrapper } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';
import { preventDefault } from '@eye8/shared/utils';

interface Props {
  count: number;
  allowedCount: number;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

const CartItemQuantity = ({ count, allowedCount, onAddClick, onRemoveClick }: Props) => {
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

export default CartItemQuantity;
