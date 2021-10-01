import { Button, Typography, Space } from 'antd';
import React from 'react';
import { Plus as PlusIcon, Minus as MinusIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { IconSize } from '@eye8/shared/styles';
import { preventDefault } from '@eye8/shared/utils';

interface Props {
  count: number;
  allowedCount: number;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

const ProductQuantity = ({ count, allowedCount, onAddClick, onRemoveClick }: Props) => {
  const intl = useIntl();

  return (
    <div>
      <Space>
        <Button
          type="primary"
          shape="circle"
          onClick={preventDefault(onRemoveClick)}
          icon={<MinusIcon size={IconSize.Small} />}
        />
        <Typography.Text strong>{count}</Typography.Text>
        <Button
          type="primary"
          shape="circle"
          onClick={preventDefault(onAddClick)}
          icon={<PlusIcon size={IconSize.Small} />}
        />
      </Space>
      {count > allowedCount && (
        <Typography.Text type="danger">
          {intl.formatMessage({ id: 'Cart.onlySomeAvailable' }, { quantity: allowedCount })}
        </Typography.Text>
      )}
    </div>
  );
};

export default ProductQuantity;
