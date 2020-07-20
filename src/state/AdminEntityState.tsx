import * as React from 'react';

import { IIntlListResponseItem } from 'src/api/IntlAPI';
import { useDependencies, IContextValue as IDependenciesContextValue } from 'src/DI/DI';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

interface IGetterParams {
  page?: number;
}

export interface IContextValue<T, M, A> {
  state: {
    entities: A[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    get: (params?: IGetterParams) => Promise<void>;
    remove: (id: number) => void;
    add: (entity: T) => void;
    set: (entity: T) => void;
    meta: M | undefined;
  };
}

interface IProviderProps {
  children?: React.ReactNode;
}

export const makeEntityState = <T extends { id: number }, M, K extends string, A>(
  Context: React.Context<IContextValue<T, M, A> | null>,
  getter: (
    d: IDependenciesContextValue,
    params?: IGetterParams,
  ) => Promise<{ entities: { [key in K]: { [key: string]: T } }; result: number[]; meta?: M }>,
  key: K,
  agregate?: (entity: T, helpers: { availableLocales: IIntlListResponseItem[] }) => A,
): React.SFC<IProviderProps> => ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const dependenciesContextValue = useDependencies();

  const [meta, setMeta] = React.useState<M | undefined>(undefined);
  const [entities, setEntities] = React.useState<{ [key: string]: T }>({});
  const [entitiesOrder, setEntitiesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const get = React.useCallback(
    async (params: IGetterParams = {}) => {
      setListLoading(true);
      try {
        const { entities, result, meta } = await getter(dependenciesContextValue, params);
        setEntities(entities[key]);
        setEntitiesOrder(result);
        setMeta(meta);
      } catch (e) {
        setListError('errors.common');
      } finally {
        setListLoading(false);
        setListLoaded(true);
      }
    },
    [dependenciesContextValue],
  );

  const add = React.useCallback(
    (entity: T) => {
      const newEntities = {
        ...entities,
        [entity.id]: entity,
      };

      const newOrder = [...entitiesOrder, entity.id];

      setEntities(newEntities);
      setEntitiesOrder(newOrder);
    },
    [entities, entitiesOrder],
  );

  const set = React.useCallback(
    (entity: T) => {
      const newEntities = {
        ...entities,
        [entity.id]: entity,
      };

      setEntities(newEntities);
    },
    [entities],
  );

  const remove = React.useCallback(
    (id: number) => {
      const newEntities = { ...entities };
      delete newEntities[id];

      const newEntitiesOrder = entitiesOrder.filter(idFromOrder => idFromOrder !== id);
      setEntitiesOrder(newEntitiesOrder);
      setEntities(newEntities);
    },
    [entities, entitiesOrder],
  );

  return (
    <Context.Provider
      value={{
        state: {
          meta,
          add,
          remove,
          entities: agregateOrderedMapToArray(
            entities,
            entitiesOrder,
            agregate ? e => agregate(e, { availableLocales }) : undefined,
          ) as A[],
          get,
          hasListLoaded,
          isListLoading,
          listError,
          set,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};
