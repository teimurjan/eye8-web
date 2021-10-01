import React from 'react';
import { RouteComponentProps } from 'react-router';

interface CheckExistenceDataArgs {
  id: number;
}

interface DeleteArgs {
  id: number;
}

export interface Props {
  View: React.ComponentType<ViewProps>;
  deleteEntity: (args: DeleteArgs) => Promise<void>;
  checkExistence: (args: CheckExistenceDataArgs) => Promise<boolean>;
  getErrorMessageID?: (e: Error) => string;
  getBackPath: () => string;
  info?: React.ReactNode;
}

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error: string | undefined;
  info: Props['info'];
}

const DeleteModalPresenter = ({
  View,
  match,
  history,
  deleteEntity,
  getBackPath,
  checkExistence,
  getErrorMessageID,
  info,
}: Props & RouteComponentProps<{ id: string }>) => {
  const id = parseInt(match.params.id, 10);

  const close = React.useCallback(() => history.push(getBackPath()), [getBackPath, history]);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const isExists = await checkExistence({ id });
        if (!isExists) {
          setError('errors.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteEntity({ id });
      setIsLoading(false);
      close();
    } catch (e) {
      setIsLoading(false);
      setError(getErrorMessageID ? getErrorMessageID(e) : 'errors.common');
    }
  }, [close, deleteEntity, getErrorMessageID, id]);

  return <View isOpen={!!id} onConfirm={remove} onClose={close} error={error} isLoading={isLoading} info={info} />;
};

export default DeleteModalPresenter;
