import React from 'react';
import { Route, useRouteMatch } from 'react-router';

interface Props {
  ListComponent: React.ComponentType<any>;
  CreateComponent: React.ComponentType<any>;
  EditComponent: React.ComponentType<any>;
  DeleteComponent: React.ComponentType<any>;
}

const Page = ({ ListComponent, CreateComponent, EditComponent, DeleteComponent }: Props) => {
  const match = useRouteMatch();
  return (
    <>
      <ListComponent />
      <Route path={`${match?.path}/new`} component={CreateComponent} />
      <Route path={`${match?.path}/edit/:id`} component={EditComponent} />
      <Route path={`${match?.path}/delete/:id`} component={DeleteComponent} />
    </>
  );
};

export default Page;
