import * as React from 'react';

import { IDependenciesContainer } from 'src/DI/DependenciesContainer';

export interface IContextValue {
  dependencies: IDependenciesContainer;
}

const Context = React.createContext<IContextValue | null>(null);

export const DIProvider = Context.Provider;

export const useDependencies = () => React.useContext(Context) as IContextValue;
