import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useDebounce } from 'src/hooks/useDebounce';

interface IPreloadDataArgs {
  id: number;
  setError: (error: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  close: () => void;
}

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  deleteEntity: (id: number) => Promise<void>;
  preloadData: (args: IPreloadDataArgs) => Promise<void>;
  getErrorMessageID?: (e: Error) => string;
  backPath: string;
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
  preloadData,
  backPath,
  deleteEntity,
  getErrorMessageID,
}: IProps & RouteComponentProps<{ id: string }>) => {
  const close = React.useCallback(() => history.push(backPath), [backPath, history]);

  const id = parseInt(match.params.id, 10);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    preloadData({ id, close, setError, setIsLoading });
  }, [close, id, preloadData]);

  const isLoadingDebounced = useDebounce(isLoading, 1000);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteEntity(id);
      setIsLoading(false);
      close();
    } catch (e) {
      setIsLoading(false);
      setError(getErrorMessageID ? getErrorMessageID(e) : 'errors.common');
    }
  }, [close, deleteEntity, getErrorMessageID, id]);

  return <View isOpen={!!id} onConfirm={remove} onClose={close} error={error} isLoading={isLoading} />;
};
