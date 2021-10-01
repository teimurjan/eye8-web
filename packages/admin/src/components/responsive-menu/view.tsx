
import { css } from '@emotion/react';
import { Layout, Drawer, Button } from 'antd';
import { Menu as MenuIcon } from 'react-feather';

import { useBoolean, useMedia } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

import Menu from '../menu';

const ResponsiveMenu = () => {
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: mobileIsOpen, setPositive: mobileOpen, setNegative: mobileClose } = useBoolean(false);

  const menu = <Menu />;

  return isMobile ? (
    <>
      <Button
        onClick={mobileOpen}
        css={css`
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 10;
        `}
        type="primary"
        icon={<MenuIcon />}
      />
      <Drawer placement="right" closable={false} onClose={mobileClose} visible={mobileIsOpen}>
        {menu}
      </Drawer>
    </>
  ) : (
    <Layout.Sider width={200}>{menu}</Layout.Sider>
  );
};

export default ResponsiveMenu;
