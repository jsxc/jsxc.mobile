import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Input, Button } from 'react-native-ui-kitten';
import { NavigationSwitchProp } from 'react-navigation';
import { useXmpp } from '../xmpp';

type Props = {
  navigation: NavigationSwitchProp;
};

const Login = (props: Props) => {
  const { navigation } = props;

  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [state, actions] = useXmpp();

  useEffect(() => {
    if (state.connection.status === 'CONNECTED') {
      navigation.navigate('Home');
    }
  }, [state.connection.status]);

  return (
    <Layout style={styles.container}>
      <Text style={styles.header} category="h3">
        Login
      </Text>

      <Input
        style={styles.textInput}
        label="URL"
        value={url}
        onChangeText={setUrl}
      />

      <Input
        style={styles.textInput}
        label="Username"
        value={username}
        onChangeText={setUsername}
      />

      <Input
        style={styles.textInput}
        label="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <Button
        style={styles.button}
        onPress={() => {
          actions.connect({ url, username, password });
        }}
      >
        {state.connection.status === 'CONNECTING' ? 'Connecting...' : 'Connect'}
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    margin: 8,
  },
  textInput: {
    margin: 8,
  },
  button: {
    margin: 8,
  },
});

export default Login;
