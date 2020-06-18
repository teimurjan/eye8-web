import * as React from 'react';

export interface IProps {
  View: React.ComponentClass<{}> | React.SFC<{}>;
}

export const SignUpPagePresenter = ({ View }: IProps) => {
  return <View />;
};
