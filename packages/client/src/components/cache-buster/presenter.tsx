import React from 'react';

import { useDI } from '@eye8/di';
import { useToast, ToastId } from '@eye8/shared/context/toast';
import { safeWindowOperation } from '@eye8/shared/utils';
import { VersionStorage } from '@eye8/storage/version';

const CACHE_DATE = new Date(2020, 7, 21);
const CACHE_VERSION = CACHE_DATE.getTime().toString();

interface Props {
  versionStorage: VersionStorage;
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  bust: () => void;
}

const CacheBusterPresenter = ({ View }: Props) => {
  const {
    di: {
      storage: { version: versionStorage },
    },
  } = useDI();

  const toast = useToast();

  React.useEffect(() => {
    const currentVersion = versionStorage.getVersion();
    const bust = () =>
      safeWindowOperation((w) => {
        versionStorage.setVersion(CACHE_VERSION);
        w.location.reload(true);
      });

    if (currentVersion && currentVersion !== CACHE_VERSION) {
      toast({
        id: ToastId.CacheBuster,
        children: <View bust={bust} />,
        type: 'primary',
        onDismiss: () => {
          versionStorage.setVersion(CACHE_VERSION);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default CacheBusterPresenter;
