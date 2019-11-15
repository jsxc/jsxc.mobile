import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout } from 'react-native-ui-kitten';
import { GiftedChat } from 'react-native-gifted-chat';
import { NavigationStackProp } from 'react-navigation-stack';
import { useXmpp } from '../hooks';
import { getWindowWidth, getWindowHeight } from '../utilities';
import { Message } from '../types';

/* TODO: Send messages & append to list */
/* TODO: Recieve messages & append to list */

type NavigationParams = {
  username: string;
};

type Props = {
  navigation: NavigationStackProp<NavigationParams>;
};

/**
 *  Adapts messages to the format that
 *  <GiftedChat /> requires.
 */
const adaptMessages = (messages: Message[]) => {
  return messages.map(message => ({
    text: message.text,
    createdAt: Date.now(),
    user: {
      _id: message.from,
      name: message.from,
      avatar:
        'http://dental266-2i09v4zdrcmtpsrxer.stackpathdns.com/wp-content/uploads/2015/07/placeholder_avatar.png',
    },
  }));
};

const Chat = (props: Props) => {
  const { navigation } = props;

  const [state, actions] = useXmpp();

  /* TODO: Implement state.data.getThread('jid') */

  /* TODO: Refactor into reusable function */
  /* TODO: Account for non-existent thread */
  const thread = state.data.threads.find(
    thread => thread.with === navigation.getParam('username'),
  );

  return (
    <Layout style={styles.container}>
      <GiftedChat
        alwaysShowSend={true}
        user={{ _id: state.credentials.username }}
        messages={adaptMessages(thread.messages)}
        onSend={([message]) => {
          actions.sendMessage({
            from: state.credentials.username,
            to: navigation.getParam('username'),
            text: message.text,
          });
        }}
      />
    </Layout>
  );
};

Chat.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('username'),
});

const styles = StyleSheet.create({
  container: {
    width: getWindowWidth(),
    height: getWindowHeight() - 65,
  },
  header: {
    alignSelf: 'center',
    margin: 16,
  },
});

export default Chat;
