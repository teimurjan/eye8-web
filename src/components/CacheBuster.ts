import pkgJSON from 'package.json';
import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import { safeWindowOperation } from 'src/utils/dom';
import { isInAppSafari } from 'src/utils/platform';

export const CacheBuster = () => {
  const {
    dependencies: {
      storages: { version: versionStorage },
    },
  } = useDependencies();

  React.useEffect(() => {
    if (isInAppSafari()) {
      return;
    }

    safeWindowOperation(w => {
      const currentVersion = versionStorage.getVersion();
      const newVersion = pkgJSON.version;

      if (!currentVersion) {
        versionStorage.setVersion(newVersion);
      } else if (currentVersion !== newVersion) {
        versionStorage.setVersion(newVersion);
        w.location.reload(true);
      }
    });
  }, [versionStorage]);

  return null;
};
