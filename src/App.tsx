import React from 'react';
import { ApplicationProvider as StylesProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
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

  return (
    <StylesProvider mapping={mapping} theme={lightTheme}>
      <AppContainer />
    </StylesProvider>
  );
};

export default App;
