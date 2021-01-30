import React from 'react';
import { RouteComponentProps } from 'react-router';

import { useSearchParams } from '@eye8/admin/hooks';

interface CheckExistenceDataArgs {
  id: number;
  deleted: boolean;
}

interface DeleteArgs {
  id: number;
  deleted: boolean;
}

interface BackPathArgs {
  id: number;
  deleted: boolean;
}

export interface Props {
  View: React.ComponentType<ViewProps>;
  deleteEntity: (args: DeleteArgs) => Promise<void>;
  checkExistence: (args: CheckExistenceDataArgs) => Promise<boolean>;
  getErrorMessageID?: (e: Error) => string;
  getBackPath: (args: BackPathArgs) => string;
}

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error: string | undefined;
}

const DEFAULT_SEARCH_PARAMS = { deleted: false };

const DeleteModalPresenter = ({
  View,
  match,
  history,
  deleteEntity,
  getBackPath,
  checkExistence,
  getErrorMessageID,
}: Props & RouteComponentProps<{ id: string }>) => {
  const { deleted } = useSearchParams(DEFAULT_SEARCH_PARAMS);

  const id = parseInt(match.params.id, 10);

  const backPath = React.useMemo(() => getBackPath({ id, deleted }), [id, getBackPath, deleted]);
  const close = React.useCallback(() => history.push(backPath), [backPath, history]);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const isExists = await checkExistence({ id, deleted });
        if (!isExists) {
          setError('AdminCategories.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [close, id, checkExistence, deleted]);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteEntity({ id, deleted });
      setIsLoading(false);
      close();
    } catch (e) {
      setIsLoading(false);
      setError(getErrorMessageID ? getErrorMessageID(e) : 'errors.common');
    }
  }, [close, deleteEntity, getErrorMessageID, id, deleted]);

  return <View isOpen={!!id} onConfirm={remove} onClose={close} error={error} isLoading={isLoading} />;
};

export default DeleteModalPresenter;
