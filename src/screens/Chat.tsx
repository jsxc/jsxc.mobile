import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from 'react-native-ui-kitten';
import { NavigationStackProp } from 'react-navigation-stack';
import { useXmpp } from '../xmpp';

type Props = {
  navigation: NavigationStackProp<{ username: string }>;
};

const Chat = (props: Props) => {
  const { navigation } = props;

  const username = navigation.getParam('username');

  const [state, actions] = useXmpp();

  return (
    <Layout style={styles.container}>
      <Text style={styles.header} category="h3">
        Chat with {username}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    alignSelf: 'center',
    margin: 16,
  },
});

export default Chat;
