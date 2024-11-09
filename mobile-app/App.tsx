import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { register } from './src/instrumentation';
import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

Sentry.init({
  dsn: 'https://8f0be35eda81112e2a8c39b2173218ee@o4508123831599104.ingest.us.sentry.io/4508208194060288',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

const App: React.FC = () => {
  useEffect(() => {
    register();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ErrorBoundary>
          <AppNavigator />
        </ErrorBoundary>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
