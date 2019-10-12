import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Login, Chats } from './screens';

const App = () => {
  const appNavigatorRoutes = {
    Authentication: { screen: Login },
    Home: { screen: Chats },
  };

  const appNavigatorConfig = {
    initialRouteName: 'Authentication',
  };

  const AppNavigator = createSwitchNavigator(
    appNavigatorRoutes,
    appNavigatorConfig,
  );

  const AppContainer = createAppContainer(AppNavigator);

  return <AppContainer />;
};

export default App;
