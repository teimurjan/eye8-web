import * as React from 'react';

export interface IProps {
  View: React.ComponentClass<{}> | React.SFC<{}>;
}

export const LoginPagePresenter = ({ View }: IProps) => {
  return <View />;
};
