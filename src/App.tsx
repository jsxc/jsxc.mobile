import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useXMPP } from './hooks';

export default function App() {
  const url = 'https://example.com:5280/http-bind/';
  const username = 'john.doe@example.com';
  const password = '123456';

  const [state, actions] = useXMPP({ url, username, password });

  const { connection, data } = state;
  const { sendMessage } = actions;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connection Status: {connection.status}</Text>

      <Button
        title="Send message"
        onPress={() => {
          sendMessage(Date.now().toString());
        }}
      />

      <Text style={styles.text}>Received messages: </Text>

      {data.receivedMessages.map((message, index) => (
        <Text key={index} style={styles.text}>
          {message.textContent}
        </Text>
      ))}
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
  text: {
    margin: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
