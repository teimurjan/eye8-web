import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useSearchParams } from 'src/components/Admin/useSearchParams';

interface IPreloadDataArgs {
  id: number;
  setError: (error: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  close: () => void;
  isForever?: boolean;
}

interface IBackPathArgs {
  id: number;
  isForever?: boolean;
}

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  deleteEntity: (id: number, isForever?: boolean) => Promise<void>;
  preloadData: (args: IPreloadDataArgs) => Promise<void>;
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
  preloadData,
  getBackPath,
  deleteEntity,
  getErrorMessageID,
}: IProps & RouteComponentProps<{ id: string }>) => {
  const { forever: foreverParam } = useSearchParams('forever');
  const isForever = foreverParam === 'true';

  const id = parseInt(match.params.id, 10);

  const backPath = React.useMemo(() => getBackPath({ id, isForever }), [id, isForever, getBackPath]);
  const close = React.useCallback(() => history.push(backPath), [backPath, history]);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    preloadData({ id, close, setError, setIsLoading, isForever });
  }, [close, id, preloadData, isForever]);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteEntity(id, isForever);
      setIsLoading(false);
      close();
    } catch (e) {
      setIsLoading(false);
      setError(getErrorMessageID ? getErrorMessageID(e) : 'errors.common');
    }
  }, [close, deleteEntity, getErrorMessageID, id, isForever]);

  return <View isOpen={!!id} onConfirm={remove} onClose={close} error={error} isLoading={isLoading} />;
};
