import React from 'react';
import { ApplicationProvider as StylesProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Login, Chats, Chat } from './screens';
import { XmppProvider } from './xmpp';

const App = () => {
  const homeNavigatorRoutes = {
    Chats: { screen: Chats },
    Chat: { screen: Chat },
  };

  const homeNavigatorConfig = {};

  const HomeNavigator = createStackNavigator(
    homeNavigatorRoutes,
    homeNavigatorConfig,
  );

  const appNavigatorRoutes = {
    Login: { screen: Login },
    Home: { screen: HomeNavigator },
  };

  const appNavigatorConfig = {
    initialRouteName: 'Login',
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
