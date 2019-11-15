import React from 'react';
import { ApplicationProvider as StylesProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Login, Chats, Chat } from './screens';
import { XmppProvider } from './hooks';
import { colors } from './constants';

const App = () => {
  const theme = {
    ...lightTheme,
    'color-primary-default': colors.PRIMARY,
    'color-primary-active': colors.PRIMARY_ACTIVE,
  };

  const homeNavigatorRoutes = {
    Chats: { screen: Chats },
    Chat: { screen: Chat },
  };

  const homeNavigatorConfig = {
    defaultNavigationOptions: () => ({
      headerStyle: {
        backgroundColor: colors.PRIMARY,
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerTintColor: 'white',
    }),
  };

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
    <StylesProvider mapping={mapping} theme={theme}>
      <XmppProvider>
        <AppContainer />
      </XmppProvider>
    </StylesProvider>
  );
};

export default App;
