// pages/_error.js

import React from 'react';
import * as Sentry from '@sentry/nextjs';

function YourCustomErrorComponent({ statusCode }) {
  return (
    <div>
      <h1>{statusCode} エラーが発生しました</h1>
      <p>申し訳ありませんが、予期せぬエラーが発生しました。</p>
    </div>
  );
}

class CustomError extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    if (err) {
      Sentry.captureException(err);
    }
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    return <YourCustomErrorComponent statusCode={statusCode} />;
  }
}

export default CustomError;
