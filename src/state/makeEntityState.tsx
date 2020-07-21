import * as React from 'react';

import { IIntlListResponseItem } from 'src/api/IntlAPI';
import { useDependencies, IContextValue as IDependenciesContextValue } from 'src/DI/DI';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue<Entity, AgregatedEntity, Meta = undefined, Params = {}> {
  state: {
    entities: AgregatedEntity[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    get: (params?: Params) => Promise<void>;
    remove: (id: number) => void;
    add: (entity: Entity) => void;
    set: (entity: Entity) => void;
    meta?: Meta;
  };
}

interface IProviderProps {
  children?: React.ReactNode;
}

export const makeEntityState = <
  Entity extends { id: number },
  Key extends string,
  AgregatedEntity,
  Meta = undefined,
  Params = {}
>(
  Context: React.Context<IContextValue<Entity, AgregatedEntity, Meta, Params> | null>,
  getter: (
    d: IDependenciesContextValue,
    params?: Params,
  ) => Promise<{ entities: { [key in Key]: { [key: string]: Entity } }; result: number[]; meta?: Meta }>,
  key: Key,
  agregate?: (entity: Entity, helpers: { availableLocales: IIntlListResponseItem[] }) => AgregatedEntity,
): React.SFC<IProviderProps> => ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const dependenciesContextValue = useDependencies();

  const [meta, setMeta] = React.useState<Meta | undefined>(undefined);
  const [data, setData] = React.useState<{ entities: { [key: string]: Entity }; order: number[] }>({
    entities: {},
    order: [],
  });
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const get = React.useCallback(
    async (params?: Params) => {
      setListLoading(true);
      try {
        const { entities, result, meta } = await getter(dependenciesContextValue, params);
        setData({ entities: entities[key], order: result });
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
    (entity: Entity) => {
      const newData = {
        entities: {
          ...data.entities,
          [entity.id]: entity,
        },
        order: [...data.order, entity.id],
      };

      setData(newData);
    },
    [data],
  );

  const set = React.useCallback(
    (entity: Entity) => {
      const newData = {
        entities: {
          ...data.entities,
          [entity.id]: entity,
        },
        order: data.order,
      };

      setData(newData);
    },
    [data],
  );

  const remove = React.useCallback(
    (id: number) => {
      const newEntities = { ...data.entities };
      delete newEntities[id];

      const newOrder = data.order.filter(idFromOrder => idFromOrder !== id);

      setData({ entities: newEntities, order: newOrder });
    },
    [data],
  );

  return (
    <Context.Provider
      value={{
        state: {
          meta,
          add,
          remove,
          entities: agregateOrderedMapToArray(
            data.entities,
            data.order,
            agregate ? e => agregate(e, { availableLocales }) : undefined,
          ) as AgregatedEntity[],
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
