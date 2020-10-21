import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useSearchParams } from 'src/components/admin/hooks/useSearchParams';

interface ICheckExistenceDataArgs {
  id: number;
  deleted: boolean;
}

interface IDeleteArgs {
  id: number;
  deleted: boolean;
}

interface IBackPathArgs {
  id: number;
  deleted: boolean;
}

export interface IProps {
  View: React.ComponentType<IViewProps>;
  deleteEntity: (args: IDeleteArgs) => Promise<void>;
  checkExistence: (args: ICheckExistenceDataArgs) => Promise<boolean>;
  getErrorMessageID?: (e: Error) => string;
  getBackPath: (args: IBackPathArgs) => string;
}

export interface IViewProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error: string | undefined;
}

export const DeleteModalPresenter = ({
  View,
  match,
  history,
  deleteEntity,
  getBackPath,
  checkExistence,
  getErrorMessageID,
}: IProps & RouteComponentProps<{ id: string }>) => {
  const { deleted } = useSearchParams<'deleted', boolean>(['deleted']);

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
