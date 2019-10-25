import React from 'react';
import { ApplicationProvider as StylesProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Login, Chats } from './screens';
import { XmppProvider } from './xmpp';

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
      <XmppProvider>
        <AppContainer />
      </XmppProvider>
    </StylesProvider>
  );
};

export default App;
