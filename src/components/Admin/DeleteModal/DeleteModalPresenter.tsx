import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useIsInstantDeletion } from 'src/components/Admin/DeleteModal/useIsInstantDeletion';

interface IPreloadDataArgs {
  id: number;
  setError: (error: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  close: () => void;
  instantly?: boolean;
}

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  deleteEntity: (id: number, instantly?: boolean) => Promise<void>;
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

  const instantly = useIsInstantDeletion();

  const id = parseInt(match.params.id, 10);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    preloadData({ id, close, setError, setIsLoading, instantly });
  }, [close, id, preloadData, instantly]);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteEntity(id, instantly);
      setIsLoading(false);
      close();
    } catch (e) {
      setIsLoading(false);
      setError(getErrorMessageID ? getErrorMessageID(e) : 'errors.common');
    }
  }, [close, deleteEntity, getErrorMessageID, id, instantly]);

  return <View isOpen={!!id} onConfirm={remove} onClose={close} error={error} isLoading={isLoading} />;
};
