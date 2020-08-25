import React from 'react';

export const reactChildrenFind = <C>(children: C | C[], match: (child: C) => boolean): C | undefined => {
  let found: C | undefined = undefined;

  React.Children.forEach(children, child => {
    if (match(child)) {
      found = child;
      return;
    }
  });

  return found;
};
