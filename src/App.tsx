import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Strophe } from 'strophe.js';
import { decodeConnectionStatusConstant } from './xmpp';

const { Connection } = Strophe;

export default function App() {
  useEffect(() => {
    const url = 'https://example.com:5280/http-bind/';
    const username = 'john.doe@example.com';
    const password = '123456';

    const connection = new Connection(url);

    connection.connect(username, password, status => {
      console.log('onConnect >', decodeConnectionStatusConstant(status));
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
