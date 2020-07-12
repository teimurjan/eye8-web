import * as Sentry from '@sentry/node';
import * as React from 'react';

export class SentryErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch && super.componentDidCatch(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}
