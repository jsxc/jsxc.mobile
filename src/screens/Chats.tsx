import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chats = () => {
  return (
    <View style={styles.container}>
      <Text>Chats</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chats;
